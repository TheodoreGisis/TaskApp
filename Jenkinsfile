pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Test'){
            steps{
                echo "Hello from git"
            }
        }
    }
}
