-- Create database if not exists
CREATE DATABASE IF NOT EXISTS research_platform;
USE research_platform;

-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'researcher',
    login_type VARCHAR(50) NOT NULL DEFAULT 'email',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Research_Profile table
CREATE TABLE IF NOT EXISTS Research_Profile (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    organization VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    research_domain VARCHAR(255) NOT NULL,
    technology_area VARCHAR(255) NOT NULL,
    research_interests TEXT,
    keywords TEXT,
    bio TEXT,
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) 
        REFERENCES Users(id) ON DELETE CASCADE,
    INDEX idx_profile_organization (organization),
    INDEX idx_profile_domain (research_domain),
    INDEX idx_profile_tech_area (technology_area)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Publications table
CREATE TABLE IF NOT EXISTS Publications (
    publication_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    authors TEXT NOT NULL,
    journal VARCHAR(255) NOT NULL,
    publication_year INT NOT NULL,
    doi VARCHAR(100),
    CONSTRAINT fk_publication_user FOREIGN KEY (user_id) 
        REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT chk_pub_year CHECK (publication_year >= 1500 AND publication_year <= 2100),
    INDEX idx_publication_user (user_id),
    INDEX idx_publication_year (publication_year),
    INDEX idx_publication_doi (doi)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Patents table
CREATE TABLE IF NOT EXISTS Patents (
    patent_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    inventor VARCHAR(255) NOT NULL,
    assignee VARCHAR(255) NOT NULL,
    technology_domain VARCHAR(255) NOT NULL,
    filing_date DATE NOT NULL,
    CONSTRAINT fk_patent_user FOREIGN KEY (user_id) 
        REFERENCES Users(id) ON DELETE CASCADE,
    INDEX idx_patent_user (user_id),
    INDEX idx_patent_domain (technology_domain),
    INDEX idx_patent_date (filing_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample records
-- Users (password hashes for demonstration)
INSERT INTO Users (full_name, email, password, role, login_type) VALUES
('Dr. Emily Carter', 'emily.carter@university.edu', '$2b$12$KPKP5o3Z6aZbe3RqyvG14eLve6eYd/Z6Hl5KqC2wG2iJe6u7O8Nte', 'researcher', 'email'),
('John Davis', 'john.davis@venturecap.com', '$2b$12$5WbA7iVvO83RqyvG14eLve3eYd/Z6Hl5KqC2wG2iJe6u7O8NteG5h', 'funder', 'email'),
('Dr. Alan Turing', 'alan.turing@institute.org', '$2b$12$RqyvG14eLve6eYd/Z6Hl5KqC2wG2iJe6u7O8NteG5h5WbA7iVvO83', 'researcher', 'email');

-- Research Profiles
INSERT INTO Research_Profile (user_id, organization, designation, research_domain, technology_area, research_interests, keywords, bio) VALUES
(1, 'State Technological University', 'Associate Professor', 'Bioinformatics & Machine Learning', 'Artificial Intelligence', 'Protein folding validation models, genetic sequencing neural architectures, health informatics', 'Bioinformatics, Deep Learning, Protein Folding, DNA sequencing', 'Dr. Emily Carter conducts pioneering research at the intersection of AI methodologies and biological systems.'),
(3, 'Institute of Advanced Science', 'Lead Researcher', 'Cryptography & Computation Theory', 'Cybersecurity', 'Enigma architectures, computing limits, decentralized computing networks', 'Cryptography, Turing Machine, Decentralized Networks', 'Dr. Alan Turing studies foundational models of computer science, network cryptography, and automation design.');

-- Publications
INSERT INTO Publications (user_id, title, authors, journal, publication_year, doi) VALUES
(1, 'Deep Learning Architectures for Protein Folding Prediction', 'E. Carter, L. Smith, K. Patel', 'Journal of Molecular Bioinformatics', 2024, '10.1016/j.jmb.2024.12345'),
(1, 'Comparative Analysis of DNA Sequencing Pipelines', 'E. Carter, M. Jones', 'Genomics and Artificial Intelligence', 2025, '10.1007/s12345-025-54321'),
(3, 'On Computable Numbers, with an Application to the Entscheidungsproblem', 'A. Turing', 'Proceedings of the London Mathematical Society', 1936, '10.1112/plms/s2-42.1.230');

-- Patents
INSERT INTO Patents (user_id, title, inventor, assignee, technology_domain, filing_date) VALUES
(1, 'Neural Network System for DNA Sequence Alignment', 'Dr. Emily Carter', 'State Technological Research Foundation', 'Genomic Processing Systems', '2025-03-12'),
(3, 'Decentralized Computation Routing Engine', 'Dr. Alan Turing', 'Advanced Computing Laboratories LLC', 'Distributed Network Processing', '2024-11-22');
