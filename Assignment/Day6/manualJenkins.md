
# Installing Jenkins and Docker in an AWS EC2 Instance

In order to do efficient, modern software development, especially for web applications, it is absolutely necessary to have a system for continuous integration (CI) and continuous delivery (CD). The idea with CI is to continuously integrate working code to the repository so that it can continuously be checked for errors. So, a prerequisite is to be using some sort of test driven development (TDD) method or at least some unit test framework; otherwise there is chance
to automatically test for errors when the code is committed to the repository. The best CI systems automate everything after the commit. A developer pushes her code, then the CI systems notices the change and automatically runs the tests. When the application passes all of its test, a continuous delivery system should then automatically put the code into the QA, staging, or testing environment. There can be a lot of steps required to get a decent CI/CD system working, here is a guide to setting up Jenkins.

Before proceeding you must have an Amazon Web Services account.

## Create an EC2 Instance

1. Log in to the AWS console and got to EC2 (Services > Compute > EC2)
2. Launch an Instance (by clicking the big “Launch Instance” button)
3. Choose an Amazon Machine Image Select Amazon Linux AMI (64-bit)
4. Choose an Instance Type Select t2.micro (in the free tier)
5. Configure Instance Details
6. Add Storage
7. Tag Instance
8. Configure Security Group Create a security group, if one does not already exist, and make sure it has the following inbound rules HTTP, port 80, (select an appropriate source, not 0.0.0.0 unless you have no other option) Custom TCP Rule, port 8080 SSH, port 22
9. Review Instance Launch Create a key to access the instance via SSH (referenced below as SSH_KEY_NAME)
10. Under Instances > Instances, select the new instance an note its Public DNS name (referenced below as PUBLIC_DNS_NAME)

### AWS EC2 Login

Login to your AWS instance

```
ssh -i \
	~/.ssh/SSH\_KEY\_NAME \
	ec2-user@PUBLIC\_DNS\_NAME
```

## Update Java

Jenkins requires Java 8 but the AWS instance is only running Java 7, to update do:

```
sudo yum install java-1.8.0
sudo yum remove java-1.7.0-openjdk
```

Verify:

```
[ec2-user@ip-172-31-25-207 ~]$ java -version
openjdk version "1.8.0_151"
OpenJDK Runtime Environment (build 1.8.0_151-b12)
OpenJDK 64-Bit Server VM (build 25.151-b12, mixed mode)
```

## Install Jenkins

Jenkins is a Continuous Integration server. Visit [Jenkins.io](https://jenkins.io/) for more information.

```
sudo yum update
sudo wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat-stable/jenkins.repo
sudo rpm --import http://pkg.jenkins-ci.org/redhat-stable/jenkins-ci.org.key
sudo yum install jenkins
sudo service jenkins start
sudo chkconfig jenkins on
```

## Install Docker & Git

```
sudo yum install -y ecs-init
sudo gpasswd -a jenkins docker
sudo service docker start
sudo chkconfig docker on
sudo yum install git
```

## GitHub Plugin

We will be using the GitHub plug-in so you should create a key to log in to GitHub

```
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
* Pick `pipeline`
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

## Setup Web Hooks
 [Web-hook-setup](https://medium.com/@marc_best/trigger-a-jenkins-build-from-a-github-push-b922468ef1ae)

## How do I know I'm done?
- [ ] I can access my Jenkins console if I log in with a username and password (your instance should not be open to anyone)
- [ ] I have a project that checks out my code and runs the stages in my Jenkinsfile

## What's left
This tutorial does not include the steps needed to give the ec2 instance permission to run aws commands
