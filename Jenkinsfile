pipeline {
    agent any
    tools {
        nodejs 'Node.js 14.17.0'
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
