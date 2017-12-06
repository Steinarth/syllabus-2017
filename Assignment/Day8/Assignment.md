For the remainder of week 2 the students will attempt to finish:
* Setting up Jenkins
* Create a project that pulls their tic tac toe code from GitHub
* Create a build step in Jenkins that runs tests, builds the code, builds a docker image and pushes to Docker Hub
* Create a deploy script that provisions a aws instance, if it doesn't already exist, and deploys with docker-compose the latest version
* Use Git Commit Tag to identify the correct image to pull with docker-compose
* When the pipeline is ready start TTD

The steps that should be included in the Jenkinsfile:

Your Jenkinsfile should list all stages and each stage should run the required scripts to complete the following tasks:

Build
* Run tests
* Build app
* Build Docker
* Archive .env
* Push docker image with Git Commit as Tag

Deploy
   * Check for running instance
   * If instance running deploy on it with:
      * Update running containers script from Day3
         * Tries to connect to instance
         * Copies all required files to the instance (docker-compose, etc…)
         * Deploys (docker-compose up) by running a script that shut downs the already running containers and starts them again (run-container script from Day3). It should take the Git Commit             Tag as argument so it knows what image to deploy.
   * Else create an instance (Use Day3 create-ec2-instance script and modify where needed)
      * Create a key-pair (change the modifier of the .pem file)
      * Create a security group
      * Authorize the security group, add http port 80 and ssh port 22
      * Create an instance that uses your newly created key-pair and security group and runs an installation script
         * The installation script (ec2-instance-init) from Day3
      * Store information about instances in ~/Path

NOTE: Make sure that Jenkins:
* has docker-compose installed
* can login to docker
* has aws command cli (should be if you use amazon-linux AMI)
* stores all needed variables in a local folder on Jenkins

NOTE: The ec2_instance folder that is created to keep track of the ec2 instance created by the scripts must survive between builds. You may need to relocate it from the current directory to the home directory.