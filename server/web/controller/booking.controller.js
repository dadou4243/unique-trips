(function() {
  'use strict';

  // External dependencies
  const lodash = require('lodash');

  // Internal dependencies
  const BookingSvc = require('../../services/booking.service');

  const AuthCore = require('../../core/auth.core');

  // service

  // transverse

  module.exports = {
    createBooking: createBooking,
    updateWord: updateWord,
    getWord: getWord,
    getAllWords: getAllWords,
    searchWord: searchWord,
    deleteWord: deleteWord,
    deleteWords: deleteWords
  };

  /**
   * @description Création d'un Booking
   * @param {object} req - la requête
   * @param {object} res - la réponse
   * @return {*} la requête
   */
  async function createBooking(req, res) {
    console.log('create booking controller', req.body);
    try {
      const bookingData = lodash.get(req, 'body');
      const bookingCreated = await BookingSvc.createBooking(bookingData);

      return res.status(200).send({
        data: bookingCreated
      });
    } catch (err) {
      return res.status(500).send({
        message: 'error in booking creation',
        error: err.toString()
      });
    }
  }

  /**
   * @description Update d'un Word
   * @param {object} req - la requête
   * @param {object} res - la réponse
   * @return {*} la requête
   */
  async function updateWord(req, res) {
    try {
      const wordData = lodash.get(req, 'body.wordData');
      console.log('wordData:', wordData);
      const overwrite = lodash.get(req, 'body.overwrite');
      console.log('overwrite:', overwrite);

      const wordUpdated = await BookingSvc.updateWord(wordData, overwrite);

      return res.status(200).send({
        data: wordUpdated
      });
    } catch (err) {
      return res.status(500).send({
        message: 'error in word update',
        error: err.toString()
      });
    }
  }

  /**
   * @description Récupération d'un word
   * @param {object} req - la requête
   * @param {object} res - la réponse
   * @return {*} la requête
   */
  async function getWord(req, res) {
    try {
      const wordID = lodash.get(req, 'params.wordID');

      const word = await BookingSvc.getWord(wordID);

      return res.status(200).send({
        data: word
      });
    } catch (err) {
      return res.status(500).send({
        auth: false,
        error: err.toString()
      });
    }
  }

  /**
   * @description Récupération d'un word
   * @param {object} req - la requête
   * @param {object} res - la réponse
   * @return {*} la requête
   */
  async function searchWord(req, res) {
    try {
      const searchString = lodash.get(req, 'params.searchString');
      // console.log('searchString:', searchString);

      const words = await BookingSvc.searchWord(searchString);

      return res.status(200).send({
        data: words
      });
    } catch (err) {
      return res.status(500).send({
        auth: false,
        error: err.toString()
      });
    }
  }

  /**
   * @description Récupération de tous les words
   * @param {object} req - la requête
   * @param {object} res - la réponse
   * @return {*} la requête
   */
  async function getAllWords(req, res) {
    console.log('req.body', req.body);
    console.log('req.query', req.query);
    // console.log('req', req);

    const sortOrder = lodash.get(req, 'query.sortOrder');
    const pageNumber = lodash.get(req, 'query.pageNumber');
    const pageSize = lodash.get(req, 'query.pageSize');

    try {
      const words = await BookingSvc.getAllWords(
        sortOrder,
        pageNumber,
        pageSize
      );

      return res.status(200).send({
        data: words
      });
    } catch (err) {
      return res.status(500).send({
        auth: false,
        error: err.toString()
      });
    }
  }

  /**
   * @description Suppression d'un word
   * @param {object} req - la requête
   * @param {object} res - la réponse
   * @return {*} la requête
   */
  async function deleteWord(req, res) {
    // console.log('deleteWord params', req.params);
    try {
      const wordToDeleteID = lodash.get(req, 'params.wordID');

      // console.log('wordToDeleteID', wordToDeleteID);

      await BookingSvc.deleteWord(wordToDeleteID);

      return res.status(200).send({
        wordID: wordToDeleteID
      });
    } catch (err) {
      return res.status(500).send({
        auth: false,
        error: err.toString()
      });
    }
  }

  /**
   * @description Suppression de plusieurs words
   * @param {object} req - la requête
   * @param {object} res - la réponse
   * @return {*} la requête
   */
  async function deleteWords(req, res) {
    console.log('req.body', req.body);
    try {
      const wordsIDArray = lodash.get(req, 'body');
      console.log('wordsIDArray:', wordsIDArray);

      const promises = [];
      for (let i = 0; i < wordsIDArray.length; i++) {
        promises.push(await BookingSvc.deleteWord(wordsIDArray[i]));
      }

      await Promise.all(promises);

      return res.status(200).send(wordsIDArray);
    } catch (err) {
      return res.status(500).send({
        auth: false,
        error: err.toString()
      });
    }
  }
})();
