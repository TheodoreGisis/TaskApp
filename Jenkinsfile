pipeline {
  agent {
    label 'docker' 
  }
    environment{
        DOCKERHUB_CREDENTIALS=credentials('teogisis-dockerhub')
    }
    tools {
        nodejs '22.9' 
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
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
        stage('Login'){
            steps{
                echo 'Login to Dockerhub'
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login --username "$DOCKERHUB_CREDENTIALS_USR" --password-stdin'
            }
        }
    }
}
