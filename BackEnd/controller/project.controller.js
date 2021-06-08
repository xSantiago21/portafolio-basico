'use strict'

var Project = require('../model/project');
var fs = require('fs');
var path = require('path');

var controller = {
    getProjects: function (req, res) { 
        Project.find().sort('-year').exec((error, projects) => {
            if (error) return res.status(500).send({ msg: 'Error al obtener los proyectos!' });
            if (!projects) return res.status(404).send({ msg: 'No hay proyectos para mostrar!' });
            return res.status(200).send({
                msg: 'Proyectos obtenidos!',
                projects
            });
        });
    },
    getProject: function (req, res) { 
        var projectId = req.params.id;
        if (!projectId) return res.status(404).send('Error al obtener el proyecto!');
        Project.findById(projectId, (error, project) => {
            if (error) return res.status(500).send('Error al obtener los datos!');
            if (!project) return res.status(404).send('El proyecto no existe!');
            return res.status(200).send({
                msg: 'Proyecto obtenido!',
                project
            });
        });
    },
    saveProject: function (req, res) { 
        var project = new Project();

        var params = req.body;
        project.name = params.name;
        project.description = params.description;
        project.category = params.category;
        project.langs = params.langs;
        project.year = params.year;
        project.image = params.image;

        project.save((error, projectSave) => {
            if (error) return res.status(500).send({ msg: 'Error al guardar el proyecto!' });
            if (!projectSave) return res.status(404).send({ msg: 'Error al guardar el proyecto!' });
            return res.status(200).send({
                msg: 'Proyecto guardado!',
                project 
            });
        });
    },
    updateProject: function (req, res) { 
        var projectToUpdate = req.body.project; 
        var act = req.body.act;
        Project.findByIdAndUpdate(projectToUpdate._id, projectToUpdate, { new: true }, (error, projUpdated) => {
            if (error) return res.status(500).send('Error al actualizar el proyecto!');
            if (!projUpdated) return res.status(404).send('Error no existe el proyecto!');
            if (act && act == 'DI') {
                fs.unlink('./uploads/images/' + projectToUpdate.image, () => {});
            }
            return res.status(200).send({
                msg: 'Proyecto actualizado!',
                project: projUpdated 
            });
        });
    },
    deleteProject: function (req, res) {
        var projectId = req.params.id;
        Project.findByIdAndDelete(projectId, (error, projectDeleted) => { 
            if (error) return res.status(500).send({ msg: 'Error al eliminar el proyecto!' });
            if (!projectDeleted) return res.status(404).send({ msg: 'Error el proyecto no se puede eliminar!' });

            fs.unlink('./uploads/images/' + projectDeleted.image, () => {});
            return res.status(200).send({
                msg: 'Proyecto eliminado!',
                project: projectDeleted  
            });
        });
    },
    uploadImage: function (req, res) { 
        var projectId = req.params.id;
        var file_name = 'Sin imagen';

        if (req.files) {
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            file_name = fileSplit[2];

            var extSplit = file_name.split('.');
            var fileExt = extSplit[1];

            if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') { 
                Project.findByIdAndUpdate(projectId, { image: file_name }, { new: true }, (error, projectUpdated) => { 
                    if (error) {
                        fs.unlink(filePath, (error) => {
                            return res.status(500).send({
                                msg: 'Error al subir la imagen!'
                            });
                        });
                    }
                    if (!projectUpdated) {
                        fs.unlink(filePath, (error) => {
                            return res.status(404).send({
                                msg: 'Error al actualizar la imagen!'
                            });
                        });
                    }
                    return res.status(200).send({
                        msg: 'Imagen actualizada!',
                        project: projectUpdated
                    });
                });
            } else {
                fs.unlink(filePath, (error) => {
                    return res.status(200).send({
                        msg: 'Formato de archivo no válido!'
                    });
                });
            }

        } else {
            return res.status(200).send({
                msg: 'No se han seleccionado archivos! ' + file_name
            });
        }
    },
    getImageFile: function (req, res) {
        var file = req.params.file;
        var path_file = './uploads/images/' + file;
        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(200).send({ msg: 'Imagen no disponible' });
            }
        });
    }
};

module.exports = controller;