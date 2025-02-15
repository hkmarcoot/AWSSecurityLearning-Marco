export const courseData = {
  modules: [
    {
      id: 1,
      title: "AWS Cloud Security Fundamentals",
      description: "Learn essential AWS security practices by implementing them in your own AWS account",
      difficulty: "beginner",
      order: 1,
      estimatedHours: 4,
      content: {
        sections: [
          {
            title: "Understanding IAM Basics",
            content: `Learn the fundamentals of AWS Identity and Access Management (IAM) and best practices for secure account management.

Exercise 1.1: Secure AWS Account Setup

Implementation Steps:
1. Create a secure root account
2. Enable MFA for root account
3. Create admin IAM user
4. Set up billing alerts

CLI Steps:
\`\`\`bash
# Create admin user
aws iam create-user --user-name admin-user

# Create admin group
aws iam create-group --group-name Administrators

# Attach admin policy
aws iam attach-group-policy \\
  --group-name Administrators \\
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess

# Add user to group
aws iam add-user-to-group \\
  --user-name admin-user \\
  --group-name Administrators
\`\`\`

Key Learning Objectives:
- Understanding AWS account structure
- Implementing root account security
- Creating admin access
- Setting up billing controls`,
            code: null
          },
          {
            title: "Setting Up AWS IAM Security Best Practices",
            content: `Learn to implement secure IAM practices by creating and managing users, groups, and policies.

Exercise 1.2: Create Secure IAM Structure

Web Console Steps:
1. Create developer group
2. Define custom IAM policies
3. Create developer users
4. Apply principle of least privilege

CLI Steps:
\`\`\`bash
# Create developer group
aws iam create-group --group-name Developers

# Create custom policy
aws iam create-policy \\
  --policy-name DeveloperAccess \\
  --policy-document file://developer-policy.json

# Attach policy to group
aws iam attach-group-policy \\
  --group-name Developers \\
  --policy-arn arn:aws:iam::ACCOUNT_ID:policy/DeveloperAccess

# Create and add users
aws iam create-user --user-name developer1
aws iam add-user-to-group \\
  --user-name developer1 \\
  --group-name Developers
\`\`\`

Real-world Scenario:
You're a security engineer at a startup that's rapidly growing. The development team needs AWS access to deploy and manage applications. Your task is to implement secure IAM practices that follow the principle of least privilege while maintaining developer productivity.

Key Learning Objectives:
- Understanding IAM hierarchy
- Implementing least privilege access
- Managing group-based access
- Creating custom policies`,
            code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::dev-artifacts-bucket",
        "arn:aws:s3:::dev-artifacts-bucket/*"
      ],
      "Condition": {
        "StringEquals": {
          "s3:x-amz-server-side-encryption": "AES256"
        }
      }
    }
  ]
}`
          },
          {
            title: "Advanced IAM Security Features",
            content: `Master advanced IAM security features including password policies, access keys, and cross-account access.

Exercise 1.3: Implement Advanced Security Controls

Web Console Steps:
1. Configure password policy
2. Set up access key rotation
3. Implement cross-account roles
4. Configure service control policies

CLI Steps:
\`\`\`bash
# Set password policy
aws iam update-account-password-policy \\
  --minimum-password-length 14 \\
  --require-symbols \\
  --require-numbers \\
  --require-uppercase-characters \\
  --require-lowercase-characters \\
  --max-password-age 90

# Create cross-account role
aws iam create-role \\
  --role-name ProductionAccess \\
  --assume-role-policy-document file://trust-policy.json

# Attach policy to role
aws iam attach-role-policy \\
  --role-name ProductionAccess \\
  --policy-arn arn:aws:iam::aws:policy/PowerUserAccess
\`\`\`

Real-world Scenario:
Your organization is implementing a multi-account strategy with separate accounts for development, staging, and production. You need to establish secure cross-account access patterns while ensuring compliance with security standards.

Key Learning Objectives:
- Implementing strong password policies
- Managing access key lifecycles
- Setting up cross-account access
- Using service control policies`,
            code: `// Lambda function for access key rotation
exports.handler = async (event) => {
  const AWS = require('aws-sdk');
  const iam = new AWS.IAM();

  const OLD_KEY_THRESHOLD_DAYS = 90;

  // List all IAM users
  const users = await iam.listUsers().promise();

  for (const user of users.Users) {
    // Get user's access keys
    const accessKeys = await iam.listAccessKeys({ 
      UserName: user.UserName 
    }).promise();

    for (const key of accessKeys.AccessKeyMetadata) {
      const keyAge = Math.floor(
        (new Date() - key.CreateDate) / (1000 * 60 * 60 * 24)
      );

      if (keyAge >= OLD_KEY_THRESHOLD_DAYS) {
        // Create new access key
        const newKey = await iam.createAccessKey({
          UserName: user.UserName
        }).promise();

        // Deactivate old key
        await iam.updateAccessKey({
          UserName: user.UserName,
          AccessKeyId: key.AccessKeyId,
          Status: 'Inactive'
        }).promise();

        // Send notification
        // Implement notification logic here
      }
    }
  }
};`
          }
        ]
      }
    },
    {
      id: 2,
      title: "CloudTrail and CloudWatch Integration",
      description: "Set up comprehensive AWS monitoring and auditing in your account",
      difficulty: "intermediate",
      order: 2,
      estimatedHours: 6,
      prerequisites: [1],
      content: {
        sections: [
          {
            title: "CloudTrail Fundamentals",
            content: `Learn the basics of AWS CloudTrail and how to set up basic logging infrastructure.

Exercise 2.1: Basic CloudTrail Setup

Implementation Steps:
1. Create S3 bucket for logs
2. Configure bucket policy
3. Create basic trail
4. Enable log validation

CLI Steps:
\`\`\`bash
# Create S3 bucket
aws s3api create-bucket \\
  --bucket audit-logs-$(date +%s) \\
  --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \\
  --bucket audit-logs \\
  --versioning-configuration Status=Enabled

# Create trail
aws cloudtrail create-trail \\
  --name basic-audit-trail \\
  --s3-bucket-name audit-logs \\
  --is-multi-region-trail \\
  --enable-log-file-validation
\`\`\`

Real-world Scenario:
You're implementing audit logging for a healthcare application that must maintain HIPAA compliance. You need to ensure all API activities are logged and the logs are tamper-proof.

Key Learning Objectives:
- Understanding CloudTrail basics
- Configuring secure log storage
- Enabling log file validation
- Managing log retention`,
            code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AWSCloudTrailAclCheck",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudtrail.amazonaws.com"
      },
      "Action": "s3:GetBucketAcl",
      "Resource": "arn:aws:s3:::audit-logs"
    },
    {
      "Sid": "AWSCloudTrailWrite",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudtrail.amazonaws.com"
      },
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::audit-logs/*",
      "Condition": {
        "StringEquals": {
          "s3:x-amz-acl": "bucket-owner-full-control"
        }
      }
    }
  ]
}`
          },
          {
            title: "Advanced CloudTrail Configuration",
            content: `Master advanced CloudTrail features including encryption, organization trails, and log analysis.

Exercise 2.2: Enhanced CloudTrail Security

Implementation Steps:
1. Create KMS key for encryption
2. Configure organization trail
3. Set up log analysis
4. Implement automated reporting

CLI Steps:
\`\`\`bash
# Create KMS key
aws kms create-key \\
  --description "CloudTrail Encryption Key"

# Create organization trail
aws cloudtrail create-trail \\
  --name org-audit-trail \\
  --s3-bucket-name org-audit-logs \\
  --kms-key-id arn:aws:kms:region:account-id:key/key-id \\
  --is-organization-trail \\
  --enable-log-file-validation

# Create metric filter
aws logs put-metric-filter \\
  --log-group-name /aws/cloudtrail/analysis \\
  --filter-name SecurityGroupChanges \\
  --filter-pattern '{$.eventName = AuthorizeSecurityGroupIngress}' \\
  --metric-transformations \\
    metricName=SecurityGroupChanges,\\
    metricNamespace=SecurityMetrics,\\
    metricValue=1
\`\`\`

Real-world Scenario:
You're implementing security monitoring for a financial services company that operates in multiple AWS regions and accounts. You need to ensure comprehensive audit logging across the organization while meeting regulatory requirements.

Key Learning Objectives:
- Implementing encrypted logging
- Managing organization-wide trails
- Analyzing CloudTrail logs
- Creating security metrics`,
            code: `exports.handler = async (event) => {
  const AWS = require('aws-sdk');
  const cloudwatch = new AWS.CloudWatch();
  const s3 = new AWS.S3();

  // Get CloudTrail log file from S3
  const logFile = await s3.getObject({
    Bucket: event.detail.bucket.name,
    Key: event.detail.object.key
  }).promise();

  // Parse and analyze logs
  const logs = JSON.parse(logFile.Body.toString());
  const securityEvents = logs.Records.filter(record => 
    record.eventName.includes('Security') ||
    record.eventName.includes('Authorization')
  );

  // Create metrics
  await cloudwatch.putMetricData({
    Namespace: 'SecurityAnalysis',
    MetricData: [{
      MetricName: 'SecurityEvents',
      Value: securityEvents.length,
      Unit: 'Count',
      Timestamp: new Date()
    }]
  }).promise();
};`
          },
          {
            title: "CloudWatch Integration and Alerting",
            content: `Learn to integrate CloudTrail with CloudWatch for real-time monitoring and automated responses.

Exercise 2.3: Advanced Monitoring Setup

Implementation Steps:
1. Set up CloudWatch Logs
2. Create metric filters
3. Configure alarms
4. Implement automated responses

CLI Steps:
\`\`\`bash
# Create log group
aws logs create-log-group \\
  --log-group-name /aws/cloudtrail/security

# Create metric filter
aws logs put-metric-filter \\
  --log-group-name /aws/cloudtrail/security \\
  --filter-name RootActivityFilter \\
  --filter-pattern '{$.userIdentity.type = Root}' \\
  --metric-transformations \\
    metricName=RootActivity,\\
    metricNamespace=SecurityMetrics,\\
    metricValue=1

# Create alarm
aws cloudwatch put-metric-alarm \\
  --alarm-name RootActivityAlarm \\
  --metric-name RootActivity \\
  --namespace SecurityMetrics \\
  --period 300 \\
  --evaluation-periods 1 \\
  --threshold 1 \\
  --comparison-operator GreaterThanOrEqualToThreshold \\
  --alarm-actions arn:aws:sns:region:account-id:security-alerts
\`\`\`

Real-world Scenario:
You're responsible for security monitoring at a large e-commerce platform. You need to implement real-time detection and response for security events across the AWS infrastructure.

Key Learning Objectives:
- Setting up real-time monitoring
- Creating effective alerts
- Implementing automated responses
- Managing alert fatigue`,
            code: `exports.handler = async (event) => {
  const AWS = require('aws-sdk');
  const sns = new AWS.SNS();
  const iam = new AWS.IAM();

  const message = JSON.parse(event.Records[0].Sns.Message);
  const severity = calculateSeverity(message);
  const response = determineResponse(severity);

  // Implement automated response
  if (response.type === 'BLOCK_ACCESS') {
    await iam.attachUserPolicy({
      UserName: response.username,
      PolicyArn: 'arn:aws:iam::aws:policy/AWSDenyAll'
    }).promise();
  }

  // Send notification
  await sns.publish({
    TopicArn: process.env.SECURITY_TOPIC_ARN,
    Message: JSON.stringify({
      title: message.AlarmName,
      severity: severity,
      details: message.NewStateReason,
      timestamp: message.StateChangeTime,
      response: response
    }),
    Subject: \`Security Incident - \${severity} Severity\`
  }).promise();
};`
          }
        ]
      }
    },
    {
      id: 3,
      title: "Infrastructure as Code with Terraform",
      description: "Build secure AWS infrastructure using Terraform",
      difficulty: "advanced",
      order: 3,
      estimatedHours: 8,
      prerequisites: [1, 2],
      content: {
        sections: [
          {
            title: "Terraform Basics and VPC Setup",
            content: `Learn to create and manage secure AWS infrastructure using Infrastructure as Code principles with Terraform.

Exercise 3.1: Set Up Basic VPC Infrastructure

Implementation Steps:
1. Create VPC with public and private subnets
2. Implement network ACLs and security groups
3. Set up VPC endpoints for AWS services
4. Configure VPC flow logs

Terraform Configuration:
\`\`\`hcl
provider "aws" {
  region = "us-west-2"
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 3.0"

  name = "secure-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-west-2a", "us-west-2b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = false

  enable_flow_logs = true
  flow_logs_destination_type = "cloud-watch-logs"
}
\`\`\`

Real-world Scenario:
Your company is moving from manually created infrastructure to Infrastructure as Code. You need to implement a secure, scalable VPC architecture that follows security best practices and can be version controlled.

Key Learning Objectives:
- Understanding IaC principles
- Implementing secure networking
- Managing infrastructure state
- Version controlling infrastructure`,
            code: `resource "aws_security_group" "app_sg" {
  name        = "app-security-group"
  description = "Security group for application servers"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "app-security-group"
    Environment = "production"
  }
}`
          },
          {
            title: "Security Groups and Network ACLs",
            content: `Learn to implement granular network security controls using Terraform.

Exercise 3.2: Configure Network Security

Implementation Steps:
1. Create layered security groups
2. Implement network ACLs
3. Set up bastion host access
4. Configure network logging

Terraform Configuration:
\`\`\`hcl
# Network ACL
resource "aws_network_acl" "private" {
  vpc_id = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  egress {
    protocol   = -1
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }

  ingress {
    protocol   = -1
    rule_no    = 100
    action     = "allow"
    cidr_block = module.vpc.vpc_cidr_block
    from_port  = 0
    to_port    = 0
  }

  tags = {
    Name = "private-subnet-acl"
  }
}
\`\`\`

Real-world Scenario:
As a DevOps engineer at a financial institution, you need to implement network security controls that comply with regulatory requirements while maintaining application accessibility.

Key Learning Objectives:
- Understanding network security layers
- Implementing defense in depth
- Managing network access controls
- Monitoring network traffic`,
            code: `resource "aws_security_group" "bastion" {
  name        = "bastion-security-group"
  description = "Security group for bastion hosts"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_ssh_cidr_blocks
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "bastion-security-group"
    Environment = "production"
  }
}`
          },
          {
            title: "Advanced Terraform Features",
            content: `Master advanced Terraform features for managing complex infrastructure.

Exercise 3.3: Implement Infrastructure Automation

Implementation Steps:
1. Set up remote state management
2. Configure state locking
3. Implement workspace management
4. Create reusable modules

Terraform Configuration:
\`\`\`hcl
terraform {
  backend "s3" {
    bucket         = "terraform-state-bucket"
    key            = "prod/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

module "s3_bucket" {
  source = "./modules/s3"

  bucket_name = "secure-artifacts"
  versioning  = true
  encryption  = true

  lifecycle_rules = [{
    enabled = true
    expiration = {
      days = 90
    }
  }]
}
\`\`\`

Real-world Scenario:
You're implementing a multi-environment infrastructure setup for a growing SaaS platform. You need to ensure infrastructure changes are tracked, versioned, and can be safely applied across environments.

Key Learning Objectives:
- Managing infrastructure state
- Implementing change control
- Creating reusable components
- Automating deployments`,
            code: `module "secure_bucket" {
  source = "./modules/s3"

  bucket_name = "secure-artifacts"
  versioning  = true
  encryption  = true

  lifecycle_rules = [{
    enabled = true
    expiration = {
      days = 90
    }
  }]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "EnforceEncryption"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:PutObject"
        Resource  = "\${aws_s3_bucket.this.arn}/*"
        Condition = {
          StringNotEquals = {
            "s3:x-amz-server-side-encryption" = "AES256"
          }
        }
      }
    ]
  })
}`
          }
        ]
      }
    }
  ],
  learningPath: {
    timeline: {
      beginner: {
        weeklyHours: 5,
        estimatedWeeks: 2,
        milestones: [
          {
            week: 1,
            goals: [
              "Complete IAM Security Fundamentals",
              "Set up MFA and secure root account",
              "Implement password policies"
            ]
          },
          {
            week: 2,
            goals: [
              "Set up CloudTrail logging",
              "Configure basic CloudWatch alarms",
              "Complete beginner security assessment"
            ]
          }
        ]
      },
      intermediate: {
        weeklyHours: 8,
        estimatedWeeks: 3,
        milestones: [
          {
            week: 1,
            goals: [
              "Implement advanced IAM policies",
              "Set up cross-account access",
              "Configure CloudWatch detailed monitoring"
            ]
          },
          {
            week: 2,
            goals: [
              "Implement automated security responses",
              "Set up advanced CloudWatch alarms",
              "Create custom CloudWatch metrics"
            ]
          },
          {
            week: 3,
            goals: [
              "Complete advanced security assessment",
              "Implement security best practices",
              "Review and optimize security configurations"
            ]
          }
        ]
      },
      advanced: {
        weeklyHours: 10,
        estimatedWeeks: 4,
        milestones: [
          {
            week: 1,
            goals: [
              "Set up Terraform development environment",
              "Create basic VPC infrastructure",
              "Implement security groups"
            ]
          },
          {
            week: 2,
            goals: [
              "Deploy multi-tier application architecture",
              "Configure VPC endpoints",
              "Implement network ACLs"
            ]
          },
          {
            week: 3,
            goals: [
              "Set up monitoring and logging",
              "Implement automated responses",
              "Configure backup and disaster recovery"
            ]
          },
          {
            week: 4,
            goals: [
              "Complete infrastructure security assessment",
              "Optimize resource configurations",
              "Document security architecture"
            ]
          }
        ]
      }
    }
  },
  quizzes: [
    {
      id: 1,
      moduleId: 1,
      question: "What is the primary purpose of AWS IAM?",
      options: [
        "Store files and documents",
        "Manage user access and permissions",
        "Monitor server performance",
        "Handle database operations"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      moduleId: 1,
      question: "What is the recommended minimum password length for IAM users?",
      options: [
        "8 characters",
        "10 characters",
        "14 characters",
        "16 characters"
      ],
      correctAnswer: 2
    },
    {
      id: 3,
      moduleId: 1,
      question: "Which security feature should be enabled for all IAM users?",
      options: [
        "Multi-Factor Authentication (MFA)",
        "Password rotation",
        "IP restrictions",
        "SSH keys"
      ],
      correctAnswer: 0
    },
    {
      id: 4,
      moduleId: 1,
      question: "What is the best practice for organizing IAM users?",
      options: [
        "Create individual policies for each user",
        "Group users and attach policies to groups",
        "Use the same policy for all users",
        "Give all users admin access"
      ],
      correctAnswer: 1
    },
    {
      id: 5,
      moduleId: 1,
      question: "How often should access keys be rotated?",
      options: [
        "Never",
        "Every 90 days",
        "Once a year",
        "Only when compromised"
      ],
      correctAnswer: 1
    },
    {
      id: 6,
      moduleId: 2,
      question: "What is the main purpose of AWS CloudTrail?",
      options: [
        "Load balancing",
        "API activity logging",
        "Container orchestration",
        "Database management"
      ],
      correctAnswer: 1
    },
    {
      id: 7,
      moduleId: 2,
      question: "How should CloudTrail logs be secured?",
      options: [
        "Store in public S3 bucket",
        "Use server-side encryption",
        "Keep logs unencrypted",
        "Store locally"
      ],
      correctAnswer: 1
    },
    {
      id: 8,
      moduleId: 2,
      question: "What feature ensures CloudTrail log integrity?",
      options: [
        "Log file validation",
        "Public access",
        "Regular backups",
        "Compression"
      ],
      correctAnswer: 0
    },
    {
      id: 9,
      moduleId: 2,
      question: "How often should CloudWatch alarms be checked?",
      options: [
        "Daily",
        "Weekly",
        "Monthly",
        "Real-time monitoring"
      ],
      correctAnswer: 3
    },
    {
      id: 10,
      moduleId: 2,
      question: "Which service helps automate responses to CloudTrail events?",
      options: [
        "AWS Lambda",
        "Amazon EC2",
        "Amazon RDS",
        "Amazon S3"
      ],
      correctAnswer: 0
    },
    {
      id: 11,
      moduleId: 3,
      question: "What is the correct command to initialize a Terraform working directory?",
      options: [
        "terraform start",
        "terraform init",
        "terraform begin",
        "terraform setup"
      ],
      correctAnswer: 1
    },
    {
      id: 12,
      moduleId: 3,
      question: "Which VPC feature should be enabled for security monitoring?",
      options: [
        "VPC Flow Logs",
        "VPC Peering",
        "VPC Endpoints",
        "VPC NAT Gateway"
      ],
      correctAnswer: 0
    },
    {
      id: 13,
      moduleId: 3,
      question: "What is the best practice for managing Terraform state files?",
      options: [
        "Store locally",
        "Use S3 with versioning",
        "Use Git",
        "Store in EC2"
      ],
      correctAnswer: 1
    },
    {
      id: 14,
      moduleId: 3,
      question: "Which tool should be used to manage sensitive Terraform variables?",
      options: [
        "AWS Secrets Manager",
        "Environment variables",
        "Plain text files",
        "Git repositories"
      ],
      correctAnswer: 0
    },
    {
      id: 15,
      moduleId: 3,
      question: "What is the purpose of Terraform workspaces?",
      options: [
        "Store credentials",
        "Manage multiple environments",
        "Run automated tests",
        "Generate documentation"
      ],
      correctAnswer: 1
    }
  ]
};