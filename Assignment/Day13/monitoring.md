# Monitoring
## Objectives
Set up DataDog monitoring for you application running on AWS.

## Steps
* Connect DataDog to AWS instance. 
* Create dashboard, you can use standard plugins for EC2 and Docker.
* Monitor what interests you.

## State
The dashboard should have at least the following metrics:
* CPU usage
* System memory
* Number of running docker containers
Choose at one of this items:
* Number of 404 and 500 errors in the application for the last hour
* Add event that shows each deployment from jenkins

