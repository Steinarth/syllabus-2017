First draft for Linux:

# Linux
Getting to know the Linux operating system

* Create a git repository on GitHub for week 1.
* Solve the following problems inside a folder for day 1 in your repository:

- [ ] What is Linux?
- [ ] Why should you use Linux? What are the pros and cons?
- [ ] Set up Linux Ubuntu 16.04 on your machine (options include, mono/dual boot, Virtual Machine options (VMWare, VirtualBox, Parallels), Boot from USB) (Not necessary on Mac)
- [ ] Install an editor (options include, VS Code, Atom, WebStorm, Sublime).
- [ ] Install git.

Create a bash script that installs all your programs/dependencies (text editor and git (more dependencies might be added later))
- [ ] Make sure all bash commands are commented.
- [ ] The script should prompt the user with:
    - [ ] With a welcome message that includes the current user’s username (the username should not be hard coded).
    - [ ] Information on what it does
    - [ ] What type of Linux system it is running on
    - [ ] Ask “are you sure you want to continue y/n” and abort if the user types in anything other than ‘y’ or ‘Y’.
- [ ] Display the date and time when the script starts and ends.
- [ ] When the script has finished display how long it took to run, e.g. “The script took 0.2ms to run”.
- [ ] The script should stop if it encounters an error and give descriptive error messages
- [ ] The script should generate an error log (script-error.log) with the error message, should not be generated on success (or at least deleted)
- [ ] The script should generate a success log report (.log file) with information on what was just accomplished (only if there are no errors).


## Git setup  ( Linux / Mac )
The following information can be found [here for creating new key](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/) and [here for adding to github](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/)
### Generate SSH key
```ssh-keygen -t rsa -b 4096 -C "your_email@example.com"```
```Enter a file in which to save the key (/home/you/.ssh/id_rsa): [Press enter]```
```
Enter passphrase (empty for no passphrase): [Press enter]
Enter same passphrase again: [Press enter]
```
### Adding SSH key to ssh-agent
```eval "$(ssh-agent -s)"```

Linux:
```ssh-add ~/.ssh/id_rsa```

Mac:
```ssh-add -K ~/.ssh/id_rsa```

### Adding new SSH key to your Github account
Linux:

```
sudo apt-get install xclip
# Downloads and installs xclip. If you don't have `apt-get`, you might need to use another installer (like 'yum')

xclip -sel clip < ~/.ssh/id_rsa.pub
# Copies the contents of the id_rsa.pub file to your clipboard
```

Mac:

```
pbcopy < ~/.ssh/id_rsa.pub
# Copies the contents of the id_rsa.pub file to your clipboard
```
* Go to github.com
* Click your profile photo in the upper-right corner -> **Settings**
* Click **SSH and GPG keys**
* Click **New SSH Key** or **Add SSH Key**
* Add name of your computer to the Title field (only for your information)
* Paste the previously copied key to the Key field
* Click **Add SSH Key**

### Clone repository from the course via ssh
```git clone git@github.com:hgop/syllabus-2017.git```
## How do I know I'm done?
- [ ] I have answered the questions about Linux
- [ ] I have created an executable script that completes all requirements
- [ ] I have commented all the lines in the script (what is the purpose of each line of code)
- [ ] I have successfully cloned the course repository via ssh
- [ ] I have commited, and pushed the script and answers to my github page so my teachers can review
