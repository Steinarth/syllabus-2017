
## Objectives
Setup Jenkins Continuous Integration Server and implement the following stories:
* Can provision new production-like environment using CI/CD server (Jenkins)

Later, having done this will enable us to achieve also:
* Can get feedback on failed tests in CI
* Can update latest version in production by push of a button

## Steps

### Own AWS account (If you are using the student account go to next section)

You will need to create an IAM role, IAM policy and an IAM instance profile. This is done
so that Jenkins gets permission to execute AWS commands without the need for installing
AWS credentials/API keys on the Jenkins server.

Note that there seem to be some issues with creating roles through aws cli,
so you may need to create the role manually through aws web console. This done in the IAM
service.

Otherwise, all commands and documents necessary to complete this task should be found here 
below.

Access policy document
```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```


### Script
AWS role creation through the CLI did not work for me though, so you may need to create the role through
the aws web console.
```
aws iam create-role --role-name StudentCICDServer  --assume-role-policy-document file://./cicd-access-policy.json
```

The rest of the script should work.
```

ARN="arn:aws:iam::aws:policy/AmazonEC2FullAccess"
aws iam attach-role-policy --role-name StudentCICDServer --policy-arn $ARN 

aws iam create-instance-profile --instance-profile-name CICDServer-Instance-Profile

aws iam add-role-to-instance-profile --role-name cicd --instance-profile-name CICDServer-Instance-Profile

aws ec2 associate-iam-instance-profile --instance-id YourInstanceId --iam-instance-profile Name=CICDServer-Instance-Profile
```


## reykjavikuniversity AWS account

The steps above are already done in this account, so students working there should begin here.

Jenkins bootstrap script for EC2 instance.
```
#!/usr/bin/env bash

exec > >(tee /var/log/user-data.log | logger -t user-data -s 2>/dev/console) 2>&1

sudo yum update
sudo wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins.io/redhat/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat/jenkins.io.key
sudo yum -y remove java-1.7.0-openjdk
sudo yum -y install java-1.8.0

sudo yum -y install docker

sudo service docker start
sudo usermod -a -G docker ec2-user

sudo yum install jenkins -y
sudo usermod -a -G docker jenkins

sudo service jenkins start

touch ec2-init-done.markerfile
```


Provision ec2 instance for running Jenkins.

```
#!/usr/bin/env bash

THISDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
source ${THISDIR}/some/relative/dir/functions.sh

USERNAME=$(aws iam get-user --query 'User.UserName' --output text)

PEM_NAME=hgop-${USERNAME}
JENKINS_SECURITY_GROUP=jenkins-${USERNAME}


if [ ! -e ./ec2_instance/security-group-id.txt ]; then
    create-security-group ${JENKINS_SECURITY_GROUP}
else
    SECURITY_GROUP_ID=$(cat ./ec2_instance/security-group-id.txt)
fi


if [ ! -e ./ec2_instance/instance-id.txt ]; then
    create-ec2-instance ami-1a962263 ${SECURITY_GROUP_ID} ${THISDIR}/bootstrap-jenkins.sh ${PEM_NAME}
fi

authorize-access ${JENKINS_SECURITY_GROUP}

set +e
scp -o StrictHostKeyChecking=no -i "./ec2_instance/${PEM_NAME}.pem" ec2-user@$(cat ./ec2_instance/instance-public-name.txt):/var/log/cloud-init-output.log ./ec2_instance/cloud-init-output.log
scp -o StrictHostKeyChecking=no -i "./ec2_instance/${PEM_NAME}.pem" ec2-user@$(cat ./ec2_instance/instance-public-name.txt):/var/log/user-data.log ./ec2_instance/user-data.log

aws ec2 associate-iam-instance-profile --instance-id $(cat ./ec2_instance/instance-id.txt) --iam-instance-profile Name=CICDServer-Instance-Profile
```

Common functions used in the script above (see the ```source``` line). Note that provisioning a Jenkins instance is almost identical to provisioning a Docker server,
so we can reuse that logic.

```
function create-key-pair(){
    if [ ! -e ${INSTANCE_DIR}/${SECURITY_GROUP_NAME}.pem ]; then
        aws ec2 create-key-pair --key-name ${SECURITY_GROUP_NAME} --query 'KeyMaterial' --output text > ${INSTANCE_DIR}/${SECURITY_GROUP_NAME}.pem
        chmod 400 ${INSTANCE_DIR}/${SECURITY_GROUP_NAME}.pem
    fi

}

function create-security-group(){
    SECURITY_GROUP_NAME=${1}
    if [ ! -e ./ec2_instance/security-group-id.txt ]; then
        export SECURITY_GROUP_ID=$(aws ec2 create-security-group --group-name ${SECURITY_GROUP_NAME} --description "security group for dev environment in EC2" --query "GroupId"  --output=text)
        echo ${SECURITY_GROUP_ID} > ./ec2_instance/security-group-id.txt
    else
        export SECURITY_GROUP_ID=$(cat ./ec2_instance/security-group-id.txt)
    fi
}

function delete-security-group(){
    SECURITY_GROUP_NAME=${1}
    if [ -e ./ec2_instance/security-group-id.txt ]; then
        SECURITY_GROUP_ID=$(cat ./ec2_instance/security-group-id.txt)
        aws ec2 delete-security-group --group-name ${SECURITY_GROUP_NAME}
        rm ./ec2_instance/security-group-id.txt
    fi
}

function create-ec2-instance(){
    AMI_IMAGE_ID=$1
    SECURITY_GROUP_ID=$2
    INSTANCE_INIT_SCRIPT=$3
    PEM_NAME=$4

    if [ ! -d ./ec2_instance/ ]; then
        mkdir ./ec2_instance/
    fi

    if [ ! -e ./ec2_instance/instance-id.txt ]; then
        set -e
        echo aws ec2 run-instances  --user-data file://${INSTANCE_INIT_SCRIPT} --image-id ${AMI_IMAGE_ID} --security-group-ids ${SECURITY_GROUP_ID} --count 1 --instance-type t2.micro --key-name ${PEM_NAME} --query 'Instances[0].InstanceId'  --output=text

        INSTANCE_ID=$(aws ec2 run-instances  --user-data file://${INSTANCE_INIT_SCRIPT} --image-id ${AMI_IMAGE_ID} --security-group-ids ${SECURITY_GROUP_ID} --count 1 --instance-type t2.micro --key-name ${PEM_NAME} --query 'Instances[0].InstanceId'  --output=text)
        echo ${INSTANCE_ID} > ./ec2_instance/instance-id.txt

        echo aws ec2 wait --region eu-west-1 instance-running --instance-ids ${INSTANCE_ID}
        aws ec2 wait --region eu-west-1 instance-running --instance-ids ${INSTANCE_ID}
        export INSTANCE_PUBLIC_NAME=$(aws ec2 describe-instances --instance-ids ${INSTANCE_ID} --query "Reservations[*].Instances[*].PublicDnsName" --output=text)
    fi

    if [ ! -e ./ec2_instance/instance-public-name.txt ]; then
        echo ${INSTANCE_PUBLIC_NAME} > ./ec2_instance/instance-public-name.txt
    fi
}


function authorize-access(){
    SECURITY_GROUP_NAME=$1
    MY_PUBLIC_IP=$(curl http://checkip.amazonaws.com)
    MY_CIDR=${MY_PUBLIC_IP}/32

    echo Adding permissions. AWS console errors are ignored.
    set +e
    aws ec2 authorize-security-group-ingress --group-name ${SECURITY_GROUP_NAME} --protocol tcp --port 22 --cidr ${MY_CIDR}
    aws ec2 authorize-security-group-ingress --group-name ${SECURITY_GROUP_NAME} --protocol tcp --port 80 --cidr ${MY_CIDR}
    aws ec2 authorize-security-group-ingress --group-name ${SECURITY_GROUP_NAME} --protocol tcp --port 8080 --cidr ${MY_CIDR}
    set -e
}

```

While testing the provisioning scripts, it is very useful to have the removal scripts also

```
#!/usr/bin/env bash

THISDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

INSTANCE_ID=$(cat ./ec2_instance/instance-id.txt)
SECURITY_GROUP_ID=$(cat ./ec2_instance/security-group-id.txt)
USERNAME=$(aws iam get-user --query 'User.UserName' --output text)

. ${THISDIR}/some/relative/dir/functions.sh

if [ -e "./ec2_instance/instance-id.txt" ]; then
    aws ec2 terminate-instances --instance-ids ${INSTANCE_ID}

    aws ec2 wait --region eu-west-1 instance-terminated --instance-ids ${INSTANCE_ID}

    rm ./ec2_instance/instance-id.txt
    rm ./ec2_instance/instance-public-name.txt
fi


PEM_NAME=hgop-${USERNAME}
JENKINS_SECURITY_GROUP=jenkins-${USERNAME}

if [ ! -e ./ec2_instance/security-group-id.txt ]; then
    SECURITY_GROUP_ID=$(cat ./ec2_instance/security-group-id.txt)
else
    delete-security-group ${JENKINS_SECURITY_GROUP}
    rm ./ec2_instance/security-group-id.txt
fi

```

## GitHub Plugin

We will be using the GitHub plug-in so you should create a key to log in to GitHub

```
ssh -i "./ec2_instance/hgop-${USERNAME}.pem" ec2-user@${INSTANCE_PUBLIC_NAME}
sudo su -s /bin/bash jenkins
cd /var/lib/jenkins/
ssh-keygen
cat .ssh/id_rsa.pub
```

Copy the public key, which was just concatenated onto the screen, and add it to your GitHub keys.

### Possible Issues

If the keygen is not printed it could be a permission issue. Here is how you can fix it:

Go edit /var/lib/jenkins/config.xml

```
sudo nano /var/lib/jenkins/config.xml
```

Change `<useSecurity>true</useSecurity>` to false\
Restart Jenkins:

```
sudo service jenkins restart
```

## Restart the instance

```
sudo reboot
```

The ssh connection will close while the system reboots, which is fine, we are done with it for now.

## Verify

Open in browser: `PUBLIC_DNS_NAME:8080` You should see the Jenkins front page

### Possible Issues

Your Jenkins instance might not have started, login to the instance again and start Jenkins:

```
sudo /etc/init.d/jenkins start
```

Check your security group and make sure port `8080` is open.

## Configure Jenkins

After completing the sign up you should setup Security Credentials

1. Manage Jenkins > Setup Security
2. Check `Enable Security`
3. Check `Logged-in users can do anything`
4. Save

## Create your first pipeline

You will use a `Jenkinsfile` to define your workflow,
[further information on using a Jenkinsfile](https://jenkins.io/doc/book/pipeline/jenkinsfile/).

Create a file called `Jenkinsfile` in your project root.

```
node {
    checkout scm
    stage('Build') {
        echo 'Building..'
    }
    stage('Test') {
        echo 'Testing..'
    }
    stage('Deploy') {
        echo 'Deploying....'
    }
}
```

Go to the Jenkins console:

* Go to `create new project`
* Pick `pipeline` project (If it is not available you will need to install the plugin)
* Under `configure` go to `Pipeline`
* Set `Definition` as `Pipeline script from SCM`
* As `SCM` choose `Git`
* Add your repository URL (ssh)
* Create new credentials:
  * Kind: `SSH Username with private key`
  * Add your username
  * Set `Private Key` as `From the Jenkins master ~/.ssh`
* Save

## Build
* Build your project
* Check the console to see if it worked

## How do I know I'm done?
- [ ] I can access my Jenkins console if I log in with a username and password (your instance should not be open to anyone)
- [ ] I have a project that checks out my code and runs the stages in my Jenkinsfile

