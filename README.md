# THIS REPO HAS BEEN CREATED FOR A RESEARCH PURPOSES AT MY UNIVERSITY AND IT IS FREE TO USE FOR ANY PURPOSE
# COPYING, MODIFYING AND REUSING THIS PROJECT ON ANY SHAPE OR FORM IS ALLOWED

Setup project (eclipse + MySql workbench):

- needed: Java 8, Maven, MySql database

1) clone this repo to your desired location
2) in Eclipse import it as existing maven project
3) right click on the citex project -> Maven -> Update Project. (Update Maven Project dialog is also reachable with Alt + F5) Make sure the
citex project is selected -> Ok. Wait untill maven updates the project and downloads all missing dependencies.
4) In MySql Server, create schema called "citex" with utf8 default collation.
5) Go to /src/main/resources/spring/data-access.properties and set up your username and password for the MySql connection
under: 
jdbc.username=
jdbc.password=
6) right click on the citex project -> run as -> run configurations (to acomplish 6.1 and 6.2 follow the same path to run configurations)
  6.1) On the top of the dialog u can enter NAME for this maven run configuration
      - for Base directory: Click Browse Workspace button and select the Citex project -> Ok
      - for Goals write: clean install
      - click apply
      - click run
      - wait for the project to build
  6.2) NOTE: this step is optional! If you want to run the project on standalone tomcat server skip this step.
      The following set of instructions will setup the project to run from self containing Tomcat7 server so
      you don't need to run it on stand alone tomcat instance.
      - On the top of the dialog u can enter NAME for this maven run configuration
      - for Base directory: Click Browse Workspace button and select the Citex project -> Ok
      - for Goals write: tomcat7:run
      - click apply
      - click run
      - wait untill project runs. It will be available on localhost:9966/citex

NOTE: both 6.1) and 6.2) configurations will be saved after this and can be accessed via: 
  - right clicking on the project -> "run as" drop down menu
