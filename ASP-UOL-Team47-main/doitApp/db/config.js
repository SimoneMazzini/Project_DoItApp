/**
 * Data structure to create sqlite database and its table.
 * @dbName name of database, may need to run from doitApp directory
 * @tables contain list of table with following two values
 *   @table name of table
 *   @sql To create table in database
 */

module.exports = {
  dbName: "./db/doit.db",
  tables:[
           { table : "users",
             sql   :  "CREATE TABLE users (" +
                      "userID                INTEGER       PRIMARY KEY AUTOINCREMENT," +
                      "userName              VARCHAR (80)  NOT NULL," +
                      "email                 VARCHAR (100) NOT NULL," +
                      "password              VARCHAR (50)  NOT NULL," +
                      "firstName             VARCHAR (10)," +
                      "lastName              VARCHAR (50)," +
                      "isAdmin               BOOLEAN       DEFAULT false," +
                      "createdDate           DATETIME," +
                      "isRegistrationConfirm BOOLEAN," +
                      "profilePicture        VARCHAR (100) "+
                  ")"

           },
           { table : "sessions",
             sql   :  "CREATE TABLE sessions (" +
                      "userID      INTEGER  REFERENCES users (userID)," +
                      "cookies     TEXT," +
                      "isValid     BOOLEAN  DEFAULT false," +
                      "timer       INTEGER  DEFAULT (120)," +
                      "createdTime DATETIME" +
                  ")"

           },
           { table : "course",
             sql   :  "CREATE TABLE course (" +
                      "courseID   INTEGER PRIMARY KEY AUTOINCREMENT," +
                      "courseName TEXT    DEFAULT ('BSc bsc computer science') " +
                  ")"

           },
           { table : "module",
             sql   :  "CREATE TABLE module (" +
                      "moduleID   INTEGER PRIMARY KEY AUTOINCREMENT," +
                      "courseID   INTEGER REFERENCES course (courseID)," +
                      "moduleName TEXT," +
                      "level      TEXT," +
                      "moduleCode TEXT" +
                  ")"

           },
           { table : "taskPriority",
             sql   :  "CREATE TABLE taskPriority (" +
                      "priorityID    INTEGER PRIMARY KEY AUTOINCREMENT," +
                      "priorityName  TEXT," +
                      "flagImage     TEXT," +
                      "priorityColor TEXT" +
                  ")"
           },
           { table : "task",
             sql   :  "CREATE TABLE task (" +
                      "taskID          INTEGER  PRIMARY KEY AUTOINCREMENT," +
                      "moduleID        INTEGER  REFERENCES module (moduleID)," +
                      "userID          INTEGER  REFERENCES users (userID)," +
                      "taskDescription TEXT," +
                      "taskStatus      INTEGER," +
                      "createDate      DATETIME," +
                      "completionDate  DATETIME" +
                  ")"
           },
           { table : "taskDetails",
             sql   :  "CREATE TABLE taskDetails (" +
                      "taskID     INTEGER  REFERENCES task (taskID)," +
                      "subTaskID  INTEGER  PRIMARY KEY AUTOINCREMENT," +
                      "taskName   TEXT," +
                      "taskDesc   TEXT," +
                      "createDate DATETIME," +
                      "dueDate    DATETIME," +
                      "priorityID INTEGER  REFERENCES taskPriority (priorityID)," +
                      "status     INTEGER" +
                  ")"
           },
           { table : "leaderboard",
             sql   :  "CREATE TABLE leaderboard (" +
                      "userID         INTEGER  REFERENCES users (userID)," +
                      "peerUserID     INTEGER  REFERENCES users (userID)," +
                      "discoveryState INTEGER," +
                      "createDate     DATETIME" +
                  ")"
           },
           { table : "earnPoint",
             sql   :  "CREATE TABLE earnPoint (" +
                      "userID         INTEGER  REFERENCES users (userID)," +
                      "taskID         INTEGER  REFERENCES task (taskID)," +
                      "earnPoint      INTEGER," +
                      "earnDate       DATETIME," +
                      "totalEarnPoint INTEGER" +
                  ")"
           },
           { table : "badge",
             sql   :  "CREATE TABLE badge (" +
                      "badgeID   INTEGER PRIMARY KEY AUTOINCREMENT," +
                      "badgeName TEXT," +
                      "picture   TEXT," +
                      "minPoint  INTEGER," +
                      "maxPoint  INTEGER" +
                  ")"
           },
           { table : "relInfo",
             sql   :  "CREATE TABLE relInfo (" +
                      "releaseID    INTEGER PRIMARY KEY AUTOINCREMENT," +
                      "releaseDescr TEXT," +
                      "releaseDate  DATE" +
                  ")"
           },
           { table : "backup",
             sql   :  "CREATE TABLE backup (" +
                      "backupID             INTEGER PRIMARY KEY AUTOINCREMENT," +
                      "backupLocation       TEXT," +
                      "adminUsername        TIME," +
                      "adminPasswordEncrypt TEXT" +
                  ")"
           },
           { table : "backupDetails",
             sql   :  "CREATE TABLE backupDetails (" +
                      "backupID          INTEGER  PRIMARY KEY AUTOINCREMENT," +
                      "backupFileDetails TEXT," +
                      "hashcode          TEXT," +
                      "backupDate        DATETIME," +
                      "backupStatus      INTEGER" +
                  ")"
           },
           { table : "backupScheduler",
             sql   :  "CREATE TABLE backupScheduler (" +
                      "scheduleFrequency INTEGER," +
                      "lastBackup        DATETIME," +
                      "nextBackup        DATETIME," +
                      "enableFlag       BOOLEAN  DEFAULT false" +
                  ")"
           },
           { table : "notification",
             sql   :  "CREATE TABLE notification (" +
                      "notifID     INTEGER  PRIMARY KEY AUTOINCREMENT," +
                      "userID      INTEGER  REFERENCES users (userID)," +
                      "description TEXT," +
                      "notifDate   DATETIME," +
                      "routeUrl    TEXT," +
                      "state       INTEGER" +
                  ")"
           },
           { table : "archiveTask",
             sql   :  "CREATE TABLE archiveTask (" +
                      "taskID          INTEGER," +
                      "moduleID        INTEGER," +
                      "taskDescription TEXT," +
                      "taskStatus      INTEGER," +
                      "createDate      DATETIME," +
                      "completionDate  DATETIME" +
                  ")"
           },
           { table : "archiveTaskDetails",
             sql   :  "CREATE TABLE archiveTaskDetails (" +
                      "taskID        INTEGER," +
                      "subTaskID     INTEGER," +
                      "taskName      TEXT," +
                      "taskDesc      TEXT," +
                      "createDate    DATETIME," +
                      "dueDate       DATETIME," +
                      "priorityID    INTEGER," +
                      "status        INTEGER" +
                  ")"
           },
           { table : "archiveEarnPoint",
             sql   :  "CREATE TABLE archiveEarnPoint (" +
                      "userID        INTEGER," +
                      "taskID         INTEGER," +
                      "earnPoint      INTEGER," +
                      "earnDate       DATETIME," +
                      "totalEarnPoint INTEGER" +
                  ")"
           }
  ],
  defaultRows:[
          { table : "course",
            sql   : [ "INSERT INTO course(courseName) VALUES ('BSc bsc computer science')"]
          },
          { table : "module",
            sql   : [ "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Introduction to programming I' , 'CM1005','Level 4', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Introduction to programming II','CM1010','Level 4', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Computational mathematics','CM1015','Level 4', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Discrete mathematics','CM1020','Level 4', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Fundamentals of computer science','CM1025','Level 4', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('How computers work','CM1030','Level 4', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Algorithms and data structures I','CM1035','Level 4', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Web development','CM1040','Level 4', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Object oriented programming','CM2005','Level 5', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Software design and development','CM2010','Level 5', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Programming with data','CM2015','Level 5', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Agile software projects','CM2020','Level 5', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Computer security','CM2025','Level 5', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Graphics programming','CM2030','Level 5', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Algorithms and data structures II','CM2035','Level 5', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Databases, networks and the web','CM2040','Level 5', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Data science','CM3005','Level 6', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Databases and advanced data techniques','CM3010','Level 6', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Machine learning and neural networks','CM3015','Level 6', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Artificial intelligence','CM3020','Level 6', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Virtual reality','CM3025','Level 6', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Games development','CM3030','Level 6', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Advanced web development','CM3035','Level 6', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Physical computing and internet of things','CM3040','Level 6', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('3D graphics and animation','CM3045','Level 6', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Mobile development','CM3050','Level 6', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Interaction design','CM3055','Level 6', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Natural language processing','CM3060','Level 6', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Intelligent signal processing','CM3065','Level 6', (select courseId from course where courseName like 'BSc bsc computer science'))",
                      "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Final project','CM3070','Level 6', (select courseId from course where courseName like 'BSc bsc computer science'))"
            ]
          },
          { table : "taskPriority",
            sql   : [ "INSERT INTO taskPriority(priorityName,flagImage,priorityColor) VALUES ('High','high.svg','Red')",
                      "INSERT INTO taskPriority(priorityName,flagImage,priorityColor) VALUES ('Medium','medium.svg','Blue')",
                      "INSERT INTO taskPriority(priorityName,flagImage,priorityColor) VALUES ('Low','low.svg','white')"
                  ]
          },
          { table : "badge",
            sql   : [ "INSERT INTO badge(badgeName,picture,minPoint,maxPoint) VALUES ('robo1','robo1.svg',1,199)",
                      "INSERT INTO badge(badgeName,picture,minPoint,maxPoint) VALUES ('robo2','robo2.svg',200,399)",
                      "INSERT INTO badge(badgeName,picture,minPoint,maxPoint) VALUES ('robo3','robo3.svg',400,599)",
                      "INSERT INTO badge(badgeName,picture,minPoint,maxPoint) VALUES ('robo4','robo4.svg',600,799)",
                      "INSERT INTO badge(badgeName,picture,minPoint,maxPoint) VALUES ('robo5','robo5.svg',800,999)"
                  ]
          },
          { table : "backupScheduler",
            sql   : [ "INSERT INTO backupScheduler(scheduleFrequency,enableFlag) VALUES (1440,false)"
                  ]
          }
  ],
  upgradeDB:[  [
    {patch: "000.1"},
    { table : "course",
      sql   : [ "select * from course"]
    },
    { table : "badgeDetails",
      sql   : [ "CREATE TABLE badgeDetails (" +
                "badgeID    INTEGER," +
                "userID     INTEGER," +
                "taskID     INTEGER," +
                "message    TEXT," +
                "createDate DATETIME" +
              ")"
            ]
    },
    { table : "module",
      sql   : [   "PRAGMA foreign_keys = 0",

                  "CREATE TABLE sqlitestudio_temp_table AS SELECT *" +
                  "                                         FROM users",


                  "DROP TABLE users",
                  "CREATE TABLE users (" +
                  "    userID                INTEGER       PRIMARY KEY AUTOINCREMENT," +
                  "    userName              VARCHAR (80)  NOT NULL," +
                  "    email                 VARCHAR (100) NOT NULL," +
                  "    password              VARCHAR (50)  NOT NULL," +
                  "    firstName             VARCHAR (10)," +
                  "    lastName              VARCHAR (50)," +
                  "    isAdmin               BOOLEAN       DEFAULT false," +
                  "    createdDate           DATETIME," +
                  "    isRegistrationConfirm BOOLEAN," +
                  "    profilePicture        VARCHAR (100)," +
                  "    slackID               TEXT" +
                  ")",

                  "INSERT INTO users (" +
                  "                     userID," +
                  "                      userName," +
                  "                      email," +
                  "                      password," +
                  "                      firstName," +
                  "                      lastName," +
                  "                      isAdmin," +
                  "                      createdDate," +
                  "                      isRegistrationConfirm," +
                  "                      profilePicture" +
                  "                  )" +
                  "                  SELECT userID," +
                  "                        userName," +
                  "                        email," +
                  "                        password," +
                  "                        firstName," +
                  "                        lastName," +
                  "                        isAdmin," +
                  "                        createdDate," +
                  "                        isRegistrationConfirm," +
                  "                        profilePicture" +
                  "                    FROM sqlitestudio_temp_table" ,

                  "DROP TABLE sqlitestudio_temp_table",

                  "PRAGMA foreign_keys = 1"
              ]
    },
    { table : "backupDetails",
      sql   : [ "PRAGMA foreign_keys = 0",

                "CREATE TABLE sqlitestudio_temp_table AS SELECT * " +
                                                          "FROM backupDetails",
                
                "DROP TABLE backupDetails",
                
                "CREATE TABLE backupDetails (" +
                    "backupID          INTEGER  REFERENCES backup (backupID)," +
                    "backupFileDetails TEXT," +
                    "hashcode          TEXT," +
                    "backupDate        DATETIME," +
                    "backupStatus      INTEGER," +
                    "snapshotID        INTEGER  PRIMARY KEY AUTOINCREMENT" +
                ")",
                
                "INSERT INTO backupDetails (" +
                                              "backupID," +
                                              "backupFileDetails," +
                                              "hashcode," +
                                              "backupDate," +
                                              "backupStatus" +
                                          ")" +
                                          "SELECT backupID," +
                                                "backupFileDetails," +
                                                "hashcode," +
                                                "backupDate," +
                                                "backupStatus " +
                                            "FROM sqlitestudio_temp_table" ,
                
                "DROP TABLE sqlitestudio_temp_table",
                
                "PRAGMA foreign_keys = 1"
             ]
    },
    { table : "course",
      sql   : [ "PRAGMA foreign_keys = 0",

                "CREATE TABLE sqlitestudio_temp_table AS SELECT * " +
                                                          "FROM backupScheduler",
                
                "DROP TABLE backupScheduler",
                
                "CREATE TABLE backupScheduler (" +
                    "scheduleFrequency INTEGER," +
                    "lastBackup        DATETIME," +
                    "nextBackup        DATETIME," +
                    "enableFlag        BOOLEAN  DEFAULT false," +
                    "backipID          INTEGER  REFERENCES backup (backupID) " +
                ")",
                
                "INSERT INTO backupScheduler (" +
                                                "scheduleFrequency," +
                                                "lastBackup," +
                                                "nextBackup," +
                                                "enableFlag" +
                                            ")" +
                                            "SELECT scheduleFrequency," +
                                                  "lastBackup," +
                                                  "nextBackup,"+
                                                  "enableFlag " +
                                              "FROM sqlitestudio_temp_table",
                
                "DROP TABLE sqlitestudio_temp_table" ,
                
                "PRAGMA foreign_keys = 1"
      ]
    },
    { table : "course",
      sql   : [ "select * from course"]
    }

  ],
  [
    {patch: "000.2"},
    { table : "course",
      sql   : [ "select * from course"]
    },
    { table : "badgeDetails",
      sql   : [ "PRAGMA foreign_keys = 0",

                "CREATE TABLE sqlitestudio_temp_table AS SELECT * " +
                                                          "FROM module",
                
                "DROP TABLE module",
                
                "CREATE TABLE module ( " +
                 "   moduleID        INTEGER PRIMARY KEY AUTOINCREMENT, " +
                 "   courseID        INTEGER REFERENCES course (courseID), " +
                 "   moduleName      TEXT, " +
                 "   level           TEXT, " +
                 "   moduleCode      TEXT, " +
                 "   moduleShortCode TEXT " +
                ")",
                
                "INSERT INTO module ( " +
                                      "moduleID, " +
                                      "courseID, " +
                                      "moduleName, " +
                                      "level, " +
                                      "moduleCode " +
                                  ") " +
                                  "SELECT moduleID, " +
                                          "courseID, " +
                                          "moduleName, " +
                                          "level, " +
                                          "moduleCode " +
                                   " FROM sqlitestudio_temp_table",
                
                "DROP TABLE sqlitestudio_temp_table",
                
                "PRAGMA foreign_keys = 1"
            ]
    },
    { table : "Update module",
            sql   : [ "UPDATE module SET moduleShortCode= 'ITP1' WHERE moduleid=1",
                      "UPDATE module SET moduleShortCode= 'ITP2' WHERE moduleid=2",
                      "UPDATE module SET moduleShortCode= 'CM' WHERE moduleid=3",
                      "UPDATE module SET moduleShortCode= 'DM' WHERE moduleid=4",
                      "UPDATE module SET moduleShortCode= 'FCS' WHERE moduleid=5",
                      "UPDATE module SET moduleShortCode= 'HCW' WHERE moduleid=6",
                      "UPDATE module SET moduleShortCode= 'ADS1' WHERE moduleid=7",
                      "UPDATE module SET moduleShortCode= 'WD' WHERE moduleid=8",
                      "UPDATE module SET moduleShortCode= 'OOP' WHERE moduleid=9",
                      "UPDATE module SET moduleShortCode= 'SDD' WHERE moduleid=10",
                      "UPDATE module SET moduleShortCode= 'PWD' WHERE moduleid=11",
                      "UPDATE module SET moduleShortCode= 'ASP' WHERE moduleid=12",
                      "UPDATE module SET moduleShortCode= 'CS' WHERE moduleid=13",
                      "UPDATE module SET moduleShortCode= 'GP' WHERE moduleid=14",
                      "UPDATE module SET moduleShortCode= 'ADS2' WHERE moduleid=15",
                      "UPDATE module SET moduleShortCode= 'DNW' WHERE moduleid=16",
                      "UPDATE module SET moduleShortCode= 'DS' WHERE moduleid=17",
                      "UPDATE module SET moduleShortCode= 'DADT' WHERE moduleid=18",
                      "UPDATE module SET moduleShortCode= 'MLNL' WHERE moduleid=19",
                      "UPDATE module SET moduleShortCode= 'AI' WHERE moduleid=20",
                      "UPDATE module SET moduleShortCode= 'VR' WHERE moduleid=21",
                      "UPDATE module SET moduleShortCode= 'GD' WHERE moduleid=22",
                      "UPDATE module SET moduleShortCode= 'AWD' WHERE moduleid=23",
                      "UPDATE module SET moduleShortCode= 'PCAIOT' WHERE moduleid=24",
                      "UPDATE module SET moduleShortCode= '3DPA' WHERE moduleid=25",
                      "UPDATE module SET moduleShortCode= 'MD' WHERE moduleid=26",
                      "UPDATE module SET moduleShortCode= 'ID' WHERE moduleid=27",
                      "UPDATE module SET moduleShortCode= 'NLP' WHERE moduleid=28",
                      "UPDATE module SET moduleShortCode= 'ISP' WHERE moduleid=29",
                      "UPDATE module SET moduleShortCode= 'FP' WHERE moduleid=30"
                  ]
    }
  ],
  [
    {patch: "000.3"},
    { table : "course",
      sql   : [ "select * from course"]
    },
    { table : "subTask",
      sql   : [ "CREATE TABLE subTask ( " +
                "taskID            INTEGER  REFERENCES task (taskID)," +
                "subTaskID         INTEGER  PRIMARY KEY AUTOINCREMENT," +
                "description            TEXT," +
                "subTaskCreateDate DATETIME," +
                "status            INTEGER," +
                "earnPoint         INTEGER," +
                "dueDate           DATETIME" +
               ")"
    
              ]
    },
    { table : "taskDetails",
      sql   : [ "PRAGMA foreign_keys = 0" ,

                "CREATE TABLE sqlitestudio_temp_table AS SELECT * " +
                                                          "FROM taskDetails",
                
                "DROP TABLE taskDetails",
                
                "CREATE TABLE taskDetails ( " +
                    "taskID                INTEGER  REFERENCES task (taskID), " +
                    "subTaskID             INTEGER  REFERENCES subTask (subTaskID), " +
                    "taskName              TEXT, " +
                    "taskDesc              TEXT, " +
                    "subTaskAssignDate     DATETIME, " +
                    "subTaskDueDate        DATETIME, " +
                    "priorityID            INTEGER  REFERENCES taskPriority (priorityID), " +
                    "status                INTEGER, " +
                    "taskDetailID          INTEGER  PRIMARY KEY AUTOINCREMENT, " +
                    "subTaskCompletionDate DATETIME " +
                ") " ,
                
                "INSERT INTO taskDetails ( " +
                                           "taskID, " +
                                            "subTaskID, " +
                                            "taskName, " +
                                            "taskDesc, " +
                                            "subTaskAssignDate, " +
                                            "subTaskDueDate, " +
                                            "priorityID, " +
                                            "status, " +
                                            "taskDetailID, " +
                                            "subTaskCompletionDate " +
                                        ") " +
                                        "SELECT taskID, " +
                                              "subTaskID, " +
                                              "taskName, " +
                                              "taskDesc, " +
                                              "subTaskCreateDate, " +
                                              "subTaskDueDate, " +
                                              "priorityID, " +
                                              "status, " +
                                              "taskDetailID, " +
                                              "subTaskCompletionDate " +
                                          "FROM sqlitestudio_temp_table",
                
                "DROP TABLE sqlitestudio_temp_table",
                
                "PRAGMA foreign_keys = 1"
                
        
    
              ]
    },
    { table : "taskDetailsPost",
      sql   : [ "CREATE TABLE taskDetailsPost ( " +
                "taskDetailID INTEGER  REFERENCES taskDetails (taskDetailID), " +
                "studentPost  TEXT, " +
                "postID       INTEGER  PRIMARY KEY AUTOINCREMENT, " +
                "postDate     DATETIME " +
               ")"
    
              ]
    }

  ],
  [
    {patch: "000.4"},
    { table : "course",
      sql   : [ "select * from course"]
    },
    { table : "archiveTaskDetails",
      sql   : [ "PRAGMA foreign_keys = 0 ",

                "CREATE TABLE sqlitestudio_temp_table AS SELECT * " +
                                                         "FROM archiveTaskDetails",
                
                "DROP TABLE archiveTaskDetails" ,
                
                "CREATE TABLE archiveTaskDetails ( " +
                    "taskID                INTEGER," +
                    "subTaskID             INTEGER," +
                    "taskName              TEXT," +
                    "taskDesc              TEXT," +
                    "subTaskAssignDate     DATETIME," +
                    "subTaskDueDate        DATETIME," +
                    "priorityID            INTEGER," +
                    "status                INTEGER," +
                    "taskDetailID          INTEGER," +
                    "subTaskCompletionDate DATETIME" +
                ")",
                
                "INSERT INTO archiveTaskDetails ( " +
                                                  "taskID, " +
                                                  "subTaskID, " +
                                                  "taskName, " +
                                                  "taskDesc, " +
                                                  "subTaskAssignDate, " +
                                                  "subTaskDueDate, " +
                                                  "priorityID, " +
                                                  "status " +
                                              ") " +
                                              "SELECT taskID, " +
                                                      "subTaskID, " +
                                                      "taskName, " +
                                                      "taskDesc, " +
                                                      "createDate, " +
                                                      "dueDate, " +
                                                      "priorityID, " +
                                                      "status " +
                                                "FROM sqlitestudio_temp_table ",
                
                "DROP TABLE sqlitestudio_temp_table",
                
                "PRAGMA foreign_keys = 1"
        
        
        
              ]
    },
    { table : "archiveTask",
      sql   : [ "PRAGMA foreign_keys = 0",

                "CREATE TABLE sqlitestudio_temp_table AS SELECT * " +
                                                          "FROM archiveTask",
                
                "DROP TABLE archiveTask",
                
                "CREATE TABLE archiveTask ( " +
                    "taskID          INTEGER, " +
                    "moduleID        INTEGER, " +
                    "taskDescription TEXT, " +
                    "taskStatus      INTEGER, " +
                    "createDate      DATETIME, " +
                    "completionDate  DATETIME, " +
                    "userID          INTEGER " +
                ")",
                
                "INSERT INTO archiveTask (" +
                                            "taskID," +
                                            "moduleID, " +
                                            "taskDescription, " +
                                            "taskStatus, " +
                                            "createDate, " +
                                            "completionDate " +
                                        ") " +
                                        "SELECT taskID, " +
                                              "moduleID, " +
                                              "taskDescription, " +
                                              "taskStatus, " +
                                              "createDate, " +
                                              "completionDate " +
                                          "FROM sqlitestudio_temp_table",
                
                "DROP TABLE sqlitestudio_temp_table",
                
                "PRAGMA foreign_keys = 1"
    ]
    },
    { table : "archiveSubTask",
      sql   : [ "CREATE TABLE archiveSubTask ( " +
                  "taskID            INTEGER, " +
                  "subTaskID         INTEGER, " +
                  "description       TEXT, " +
                  "subTaskCreateDate DATETIME, " +
                  "status            INTEGER, " +
                  "earnPoint         INTEGER, " +
                  "dueDate           DATETIME " +
              ")"
            ]
    },
    { table : "course",
      sql   : [ "CREATE TABLE archiveTaskDetailsPost ( " +
                  "taskDetailID INTEGER, " +
                  "studentPost     TEXT, " +
                  "postID          INTEGER, " +
                  "postDate        DATETIME " +
              ")"
               ]
    },
    { table : "subTask",
      sql   : [ "PRAGMA foreign_keys = 0",

                  "CREATE TABLE sqlitestudio_temp_table AS SELECT * " +
                                                           " FROM subTask",
                  
                  "DROP TABLE subTask",
                  
                  "CREATE TABLE subTask ( " +
                      "taskID            INTEGER  REFERENCES task (taskID),  " +
                      "subTaskID         INTEGER  PRIMARY KEY AUTOINCREMENT,  " +
                      "description       TEXT,  " +
                      "subTaskCreateDate DATETIME,  " +
                      "status            INTEGER, " +
                      "earnPoint         INTEGER, " +
                      "dueDate           DATETIME " +
                  ")",
                  
                  "INSERT INTO subTask ( " +
                                          "taskID, " +
                                          "subTaskID, " +
                                          "description, " +
                                          "subTaskCreateDate, " +
                                          "status, " +
                                          "earnPoint, " +
                                          "dueDate " +
                                      ") " +
                                      "SELECT taskID, " +
                                            "subTaskID, " +
                                            "'desc', " +
                                            "subTaskCreateDate, " +
                                            "status, " +
                                            "earnPoint, " +
                                            "dueDate " +
                                        "FROM sqlitestudio_temp_table " ,
                  
                  "DROP TABLE sqlitestudio_temp_table",
                  
                  "PRAGMA foreign_keys = 1"
      ]
    },
  ],
  [
    {patch: "000.5"},
    { table : "course",
      sql   : [ "select * from course"]
    },
    { table : "subTask",
      sql   : [ "PRAGMA foreign_keys = 0",

                "CREATE TABLE sqlitestudio_temp_table AS SELECT * " +
                                                          "FROM subTask",
                
                "DROP TABLE subTask" ,
                
                "CREATE TABLE subTask ( " +
                    "taskID            INTEGER  REFERENCES task (taskID), " +
                    "subTaskID         INTEGER  PRIMARY KEY AUTOINCREMENT, " +
                    "description       TEXT, " +
                    "subTaskCreateDate DATETIME, " +
                    "status            INTEGER, " +
                    "earnPoint         INTEGER, " +
                    "dueDate           DATETIME, " +
                    "UUID              TEXT " +
                ")",
                
                "INSERT INTO subTask ( " +
                                        "taskID, " +
                                        "subTaskID, " +
                                        "description, " +
                                        "subTaskCreateDate, " +
                                        "status, " +
                                        "earnPoint, " +
                                        "dueDate " +
                                    ") " +
                                    "SELECT taskID, " +
                                          "subTaskID, " +
                                          "description, " +
                                          "subTaskCreateDate, " +
                                          "status, " +
                                          "earnPoint, " +
                                          "dueDate " +
                                      "FROM sqlitestudio_temp_table " ,
                
                "DROP TABLE sqlitestudio_temp_table",
                
                "PRAGMA foreign_keys = 1"
    ]
    },
    { table : "course",
      sql   : [ "PRAGMA foreign_keys = 0",

                "CREATE TABLE sqlitestudio_temp_table AS SELECT * " +
                                                          "FROM taskDetails",
                
                "DROP TABLE taskDetails",
                
                "CREATE TABLE taskDetails ( " +
                    "taskID                INTEGER  REFERENCES task (taskID), " +
                    "subTaskID             INTEGER  REFERENCES subTask (subTaskID), " +
                    "taskName              TEXT, " +
                    "taskDesc              TEXT, " +
                    "subTaskAssignDate     DATETIME, " +
                    "subTaskDueDate        DATETIME, " +
                    "priorityID            INTEGER  REFERENCES taskPriority (priorityID), " +
                    "status                INTEGER, " +
                    "taskDetailID          INTEGER  PRIMARY KEY AUTOINCREMENT, " +
                    "subTaskCompletionDate DATETIME, " +
                    "taskDetailUUID        TEXT " +
                ")",
                
                "INSERT INTO taskDetails ( " +
                                            "taskID, " +
                                            "subTaskID, " +
                                            "taskName, " +
                                            "taskDesc, " +
                                            "subTaskAssignDate, " +
                                            "subTaskDueDate, " +
                                            "priorityID, " +
                                            "status, " +
                                            "taskDetailID, " +
                                            "subTaskCompletionDate " +
                                        ") " +
                                        "SELECT taskID, " +
                                              "subTaskID, " +
                                              "taskName, " +
                                              "taskDesc, " +
                                              "subTaskAssignDate, " +
                                              "subTaskDueDate, " +
                                              "priorityID, " +
                                              "status, " +
                                              "taskDetailID, " +
                                              "subTaskCompletionDate " +
                                          "FROM sqlitestudio_temp_table " ,
                
                "DROP TABLE sqlitestudio_temp_table",
                
                "PRAGMA foreign_keys = 1"
      ]
    },
  ],
  [
    {patch: "000.6"},
    { table : "course",
      sql   : [ "select * from course"]
    },
    { table : "course",
      sql   : [ "select * from course"]
    },
    { table : "course",
      sql   : [ "PRAGMA foreign_keys = 0",

                "CREATE TABLE sqlitestudio_temp_table AS SELECT * " +
                                                          "FROM earnPoint",
                
                "DROP TABLE earnPoint",
                
                "CREATE TABLE earnPoint ( " +
                    "userID         INTEGER  REFERENCES users (userID), " +
                    "taskID         INTEGER, " +
                    "earnPoint      INTEGER, " +
                    "earnDate       DATETIME, " +
                    "totalEarnPoint INTEGER, " +
                    "epochDate      INTEGER, " +
                    "moduleID       INTEGER, " +
                    "UUID           TEXT " +
                ")",
                
                "INSERT INTO earnPoint ( " +
                                         " userID, " +
                                         " taskID, " +
                                          "earnPoint, " +
                                          "earnDate, " +
                                          "totalEarnPoint " +
                                      ") " +
                                      "SELECT userID, " +
                                            "taskID, " +
                                            "earnPoint, " +
                                            "earnDate, " +
                                            "totalEarnPoint " +
                                        "FROM sqlitestudio_temp_table " ,
                
                "DROP TABLE sqlitestudio_temp_table",
                
                "PRAGMA foreign_keys = 1"
             ]
    }
  ]
]

};