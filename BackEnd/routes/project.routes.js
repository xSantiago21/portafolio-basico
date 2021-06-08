'use strict'

var express = require('express');
var ProjectController = require('../controller/project.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './uploads/images' });

router.get('/project', ProjectController.getProjects);
router.get('/project/:id?', ProjectController.getProject);
router.post('/project/save', ProjectController.saveProject);
router.post('/project/update', ProjectController.updateProject);
router.delete('/project/delete/:id', ProjectController.deleteProject);
router.post('/project/uploadimg/:id', multipartMiddleware, ProjectController.uploadImage);
router.get('/project/getimgfile/:file', ProjectController.getImageFile);

module.exports = router;