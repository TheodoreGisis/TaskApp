pipeline {
    agent any
    tools {
        nodejs 'Default'
    }
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
        stage('Install'){
            steps{
                sh 'npm install'
            }
        }
        stage('Build'){
            steps{
                sh 'npm run build'
            }
        }
    }
}
