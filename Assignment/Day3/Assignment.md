# Day 3 - Provision environment in AWS.

## Objectives

* To be able to run application on an AWS EC2 instance.

## Step 1 - Getting started with Amazon Web Services

### Provision production-like environment spike

Number one: Log carefully all steps you take. I recommend creating a text document
and copying/pasting all commands you make into that document. If you forget to log
a significant command, you can access it later using the "history" command.

Set up your AWS account. Follow instructions here:

[Get set up for AWS ECS](http://docs.aws.amazon.com/AmazonECS/latest/developerguide/get-set-up-for-amazon-ecs.html)

You can skip the last optional step but instead you need to install the [AWS Command Line Interface](http://docs.aws.amazon.com/cli/latest/userguide/installing.html)

Login to aws. You must have your AWS credentials first.

```bash
aws configure
```

Command line will ask you for your credentials. You can access this from the aws web console
console.aws.amazon.com -> "My Security Credentials"


When up and running with AWS, and you can access the management console web UI,
follow this tutorial:
**STOP when you see the heading "Deploying Docker containers on ECS"**
https://www.ybrikman.com/writing/2015/11/11/running-docker-aws-ground-up/#launching-an-ec2-instance

Exchange the name/tag of the docker image used in the tutorial with the name of your docker image.

At this point you should have the dockerized application running on an EC2 instance.

### How do I know I'm done?

* [ ] I've created an account on AWS
* [ ] I have one AWS instance running
* [ ] I have my docker image running on my AWS instance
* [ ] I can visit my AWS site using its public DNS, example `http://ec2-SOME-NUMBERS.us-west-2.compute.amazonaws.com/` and see my application running

## Step 2 - Provision production-like environment script

Apart from login and ssh keys generation, all the steps above are scriptable.
Create a script (bash, make), which allows you to provision a new
server automatically. One of the things aws ec2 commands allow, are to specify
a script that is run on the newly provisioned server.

Create a folder named "provisioning" in the project and store this script there.


Below is a list of commands you will need to assemble into a set of working
scripts. Place echo commands into the script as you assemble it to log progress through the
script, with meaningful message. Also comment each aws command explaining what
it does, in your own words (no copying or pasting from internet or other students).

Almost all file names can be reverse-engineered from the source code below.
 
### Create an EC2 instance
```bash
INSTANCE_DIR="ec2_instance"
if [ -d "${INSTANCE_DIR}" ]; then
    exit
fi

[ -d "${INSTANCE_DIR}" ] || mkdir ${INSTANCE_DIR}


aws ec2 create-key-pair --key-name ${SECURITY_GROUP_NAME} --query 'KeyMaterial' --output text > ${INSTANCE_DIR}/${SECURITY_GROUP_NAME}.pem
chmod 400 ${INSTANCE_DIR}/${SECURITY_GROUP_NAME}.pem
SECURITY_GROUP_ID=$(aws ec2 create-security-group --group-name ${SECURITY_GROUP_NAME} --description "security group for dev environment in EC2" --query "GroupId"  --output=text)
echo ${SECURITY_GROUP_ID} > ./ec2_instance/security-group-id.txt
MY_PUBLIC_IP=$(curl http://checkip.amazonaws.com)

MY_CIDR=${MY_PUBLIC_IP}/32
aws ec2 authorize-security-group-ingress --group-name ${SECURITY_GROUP_NAME} --protocol tcp --port 80 --cidr ${MY_CIDR}
INSTANCE_ID=$(aws ec2 run-instances --user-data file://ec2-instance-init.sh --image-id ami-9398d3e0 --security-group-ids ${SECURITY_GROUP_ID} --count 1 --instance-type t2.micro --key-name ${SECURITY_GROUP_NAME} --query 'Instances[0].InstanceId'  --output=text)
echo ${INSTANCE_ID} > ./ec2_instance/instance-id.txt
aws ec2 wait --region eu-west-1 instance-running --instance-ids ${INSTANCE_ID}
export INSTANCE_PUBLIC_NAME=$(aws ec2 describe-instances --instance-ids ${INSTANCE_ID} --query "Reservations[*].Instances[*].PublicDnsName" --output=text)
echo ${INSTANCE_PUBLIC_NAME} > ./ec2_instance/instance-public-name.txt
```

### EC2 instance init script
```bash
#!/bin/bash

exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

sudo yum -y update
sudo yum -y install docker
sudo pip install docker-compose
sudo pip install backports.ssl_match_hostname --upgrade

sudo service docker start
sudo usermod -a -G docker ec2-user

touch ec2-init-done.markerfile
```


### Instance check

```bash
while ! test -e 'ec2-init-done.markerfile'
do
    sleep 2
done
```

### Updating running containers



```bash
INSTANCE_ID=$(cat ./ec2_instance/instance-id.txt)
INSTANCE_PUBLIC_NAME=$(cat ./ec2_instance/instance-public-name.txt)
SECURITY_GROUP_NAME=$(cat ./ec2_instance/security-group-name.txt)

status='unknown'
while [ ! "${status}" == "ok" ]
do
   status=$(ssh -i "./ec2_instance/${SECURITY_GROUP_NAME}.pem"  -o StrictHostKeyChecking=no -o BatchMode=yes -o ConnectTimeout=5 ec2-user@${INSTANCE_PUBLIC_NAME} echo ok 2>&1)
   sleep 2
done

scp -o StrictHostKeyChecking=no -i "./ec2_instance/${SECURITY_GROUP_NAME}.pem" ./ec2-instance-check.sh ec2-user@${INSTANCE_PUBLIC_NAME}:~/ec2-instance-check.sh
scp -o StrictHostKeyChecking=no -i "./ec2_instance/${SECURITY_GROUP_NAME}.pem" ./docker-compose.yaml ec2-user@${INSTANCE_PUBLIC_NAME}:~/docker-compose.yaml
scp -o StrictHostKeyChecking=no -i "./ec2_instance/${SECURITY_GROUP_NAME}.pem" ./docker-compose-and-run.sh ec2-user@${INSTANCE_PUBLIC_NAME}:~/docker-compose-and-run.sh

ssh -o StrictHostKeyChecking=no -i "./ec2_instance/${SECURITY_GROUP_NAME}.pem" ec2-user@${INSTANCE_PUBLIC_NAME} "cat ~/ec2-instance-check.sh"
ssh -o StrictHostKeyChecking=no -i "./ec2_instance/${SECURITY_GROUP_NAME}.pem" ec2-user@${INSTANCE_PUBLIC_NAME} "cat ~/docker-compose-and-run.sh"
ssh -o StrictHostKeyChecking=no -i "./ec2_instance/${SECURITY_GROUP_NAME}.pem" ec2-user@${INSTANCE_PUBLIC_NAME} "~/docker-compose-and-run.sh ${GIT_COMMIT}"

```

### Run the container(s)

```bash
docker-compose down
docker-compose up -d --build

```


### Destroy EC2 instance.
```bash
INSTANCE_ID=$(cat ./ec2_instance/instance-id.txt)
SECURITY_GROUP_ID=$(cat ./ec2_instance/security-group-id.txt)
SECURITY_GROUP_NAME=$(cat ./ec2_instance/security-group-name.txt)

aws ec2 terminate-instances --instance-ids ${INSTANCE_ID}

aws ec2 wait --region eu-west-1 instance-terminated --instance-ids ${INSTANCE_ID}
aws ec2 delete-security-group --group-id ${SECURITY_GROUP_ID}

aws ec2 delete-key-pair --key-name ${SECURITY_GROUP_NAME}

rm  -rf ec2_instance
```

### Docker-compose image and commit id tag
In order to tell docker-compose which image tag to pull when deploying you need to set a docker-compose environment variable.

`https://docs.docker.com/compose/environment-variables/`

You do it by creating a file called .env in the same directory as your docker-compose file is located. Then you reference using $VariableName (see link above).

When you deploy on aws make sure you copy the .env file or recreated with the git commit_id on the aws instance.

### Scripts to implement

You should be able to run:
~~~bash
./create-new-aws-docker-host-instance.sh 
~~~
Should create a new AWS EC2 instance. With all programs needed to use your app's docker-compose file.

~~~bash
./deploy-on-instance.sh GIT_COMMIT_ID INSTANCE_ID
~~~
Should deploy the docker image associated with with provided GIT_COMMIT_ID, to the aws instance associated with the provided INSTANCE_ID. If the app is already running on the instance it should be taken down and the image associated with the GIT_COMMIT_ID deployed in its place.

~~~bash
./destroy-instance.sh INSTANCE_ID
~~~
Should destroy the instance associated with INSTANCE_ID.

### How do I know I'm done?

Start by destroying any running instances on your account.

~~~bash
./create-new-aws-docker-host-instance.sh 
~~~

You should see an instance running in your aws console (you can use the web ui to verify, or better yet the terminal).

Visit `http://ec2-SOME-NUMBERS.us-west-2.compute.amazonaws.com/` the url for your instance. Your app should not be running yet.

Push a new image to docker with current git commit_id as it's tag.
~~~
# Get the commit id
git rev-parse HEAD
# Tag your docker image
docker tag image john/week1:COMMIT_ID
# Push to docker hub
docker push john/week1:COMMIT_ID
~~~

Now run:
~~~bash
./deploy-on-instance.sh GIT_COMMIT_ID INSTANCE_ID
~~~

Visit `http://ec2-SOME-NUMBERS.us-west-2.compute.amazonaws.com/` the url for your instance. Your app should be up and running.
