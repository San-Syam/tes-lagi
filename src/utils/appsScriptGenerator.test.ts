/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { generateCodeGs, generateIndexHtml } from './appsScriptGenerator';
import { DEFAULT_QUESTIONS } from '../data/defaultQuestions';
import { ExamSettings } from '../types/cbt';

test('generateCodeGs includes database setup and webapp handler', () => {
  const dummySettings: ExamSettings = {
    title: 'Simulasi TKA Pusmendik',
    subTitle: 'Kemendikdasmen RI',
    jenjang: 'SMP/MTs',
    subject: 'Literasi & Numerasi',
    durationMinutes: 45,
    token: 'PUSMENDIK26',
    totalSoal: 6,
    kkm: 70,
    sheetNamePrefix: 'DB_CBT',
  };

  const codeGs = generateCodeGs(dummySettings, DEFAULT_QUESTIONS);
  assert.equal(codeGs.includes('function setupDatabase()'), true);
  assert.equal(codeGs.includes('SpreadsheetApp.create'), true);
  assert.equal(codeGs.includes('function doGet(e)'), true);
  assert.equal(codeGs.includes('function submitExam(payload)'), true);
  assert.equal(codeGs.includes('PUSMENDIK26'), true);
});

test('generateIndexHtml produces responsive standalone HTML for Apps Script', () => {
  const dummySettings: ExamSettings = {
    title: 'Simulasi TKA Pusmendik',
    subTitle: 'Kemendikdasmen RI',
    jenjang: 'SMP/MTs',
    subject: 'Literasi & Numerasi',
    durationMinutes: 45,
    token: 'PUSMENDIK26',
    totalSoal: 6,
    kkm: 70,
    sheetNamePrefix: 'DB_CBT',
  };

  const html = generateIndexHtml(dummySettings, DEFAULT_QUESTIONS);
  assert.equal(html.includes('<!DOCTYPE html>'), true);
  assert.equal(html.includes('id="screen-login"'), true);
  assert.equal(html.includes('id="screen-exam"'), true);
  assert.equal(html.includes('id="modal-daftar-soal"'), true);
  assert.equal(html.includes('google.script.run'), true);
});
