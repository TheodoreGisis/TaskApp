pipeline {
    agent any
    tools {
        nodejs '22.9' 
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Test'){
            steps{
                echo 'Building...'
                sh 'npm install'
            }
        }
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker Image'
                script {
                    // Define your image name and tag
                    def imageName = 'teogisis/taskapp'
                    def imageTag = 'latest' // You can change this to use a specific tag
                    
                    // Build the Docker image
                    sh "docker build -t ${imageName}:${imageTag} ."
                }
            }
        }
    }
}
