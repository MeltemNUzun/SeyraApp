-- Veritabanı oluşturma
CREATE DATABASE IF NOT EXISTS ServerManagement;
GO

USE ServerManagement;
GO

-- ServerTypes Tablosu
CREATE TABLE ServerTypes (
                             ServerTypeId INT IDENTITY(1,1) PRIMARY KEY,
                             ServerTypeName VARCHAR(50) NOT NULL
);

-- LogTypes Tablosu
CREATE TABLE LogTypes (
                          LogTypeId INT IDENTITY(1,1) PRIMARY KEY,
                          LogTypeName VARCHAR(50) NOT NULL
);

-- Roles Tablosu
CREATE TABLE Roles (
                       RoleId INT IDENTITY(1,1) PRIMARY KEY,
                       RoleName VARCHAR(50) NOT NULL,
                       ServerTypeId INT NOT NULL,
                       FOREIGN KEY (ServerTypeId) REFERENCES ServerTypes(ServerTypeId)
);

-- Users Tablosu
CREATE TABLE Users (
                       UserId INT IDENTITY(1,1) PRIMARY KEY,
                       Username VARCHAR(100) NOT NULL UNIQUE,
                       PasswordHash VARCHAR(255) NOT NULL,
                       Email VARCHAR(150) NOT NULL UNIQUE, -- Yeni sütun
                       RoleId INT NOT NULL,
                       FOREIGN KEY (RoleId) REFERENCES Roles(RoleId)
);

-- Server Tablosu (Servers yerine güncellendi)
CREATE TABLE Server (
                        ServerId INT IDENTITY(1,1) PRIMARY KEY,
                        ServerName VARCHAR(100) NOT NULL,
                        ServerTypeId INT NOT NULL,
                        IPAddress VARCHAR(15) NOT NULL,
                        ServerUsername VARCHAR(100) NOT NULL, -- Yeni sütun
                        ServerPassword VARCHAR(255) NOT NULL, -- Yeni sütun
                        FOREIGN KEY (ServerTypeId) REFERENCES ServerTypes(ServerTypeId)
);

-- Logs Tablosu
CREATE TABLE Logs (
                      LogId INT IDENTITY(1,1) PRIMARY KEY,
                      LogTypeId INT NOT NULL,
                      Timestamp DATETIME NOT NULL,
                      Message TEXT,
                      ServerId INT NOT NULL,
                      FOREIGN KEY (LogTypeId) REFERENCES LogTypes(LogTypeId),
                      FOREIGN KEY (ServerId) REFERENCES Server(ServerId)
);

-- 'Tüm Sunucular' adlı bir sunucu türü ekleyelim, sadece Admin'e atanacak
INSERT INTO ServerTypes (ServerTypeName)
VALUES ('All Servers');  -- Bu sadece Admin rolüne atanacak özel bir tür

-- 'Web Sunucuları' adlı bir sunucu türü
INSERT INTO ServerTypes (ServerTypeName)
VALUES ('Web Servers');

-- 'E-posta Sunucuları' adlı bir sunucu türü
INSERT INTO ServerTypes (ServerTypeName)
VALUES ('Mail Servers');

-- 'Veritabanı Sunucuları' adlı bir sunucu türü
INSERT INTO ServerTypes (ServerTypeName)
VALUES ('Database Servers');

-- Admin rolünü 'Tüm Sunucular' türüyle
INSERT INTO Roles (RoleName, ServerTypeId)
VALUES ('Admin', (SELECT ServerTypeId FROM ServerTypes WHERE ServerTypeName = 'All Servers'));

-- 'Web Admin' rolünü 'Web Sunucuları' türüyle
INSERT INTO Roles (RoleName, ServerTypeId)
VALUES ('Web Admin', (SELECT ServerTypeId FROM ServerTypes WHERE ServerTypeName = 'Web Servers'));

-- 'Mail Admin' rolünü 'E-posta Sunucuları' türüyle
INSERT INTO Roles (RoleName, ServerTypeId)
VALUES ('Mail Admin', (SELECT ServerTypeId FROM ServerTypes WHERE ServerTypeName = 'Mail Servers'));

-- 'Database Admin' rolünü 'Veritabanı Sunucuları' türüyle
INSERT INTO Roles (RoleName, ServerTypeId)
VALUES ('Database Admin', (SELECT ServerTypeId FROM ServerTypes WHERE ServerTypeName = 'Database Servers'));

-- Admin kullanıcısını ekleyelim (SHA256 hash)
INSERT INTO Users (Username, PasswordHash, Email, RoleId)
VALUES ('admin', '4fbe32f6dfe4b6f4046c02c4c2b15afba15e849a22a674c540902ff0b02896a2', 'admin@example.com',
        (SELECT RoleId FROM Roles WHERE RoleName = 'Admin'));
