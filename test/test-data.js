

const program = {
  path: 'test',
  secret: 'secret',
  apiKey: 'apikey',
  projectId: 'projectid',
  fileName: 'en-US',
  console: false,
  optimistic: true,
  locales: 'en-US,id'
};

const oneSkyReply = JSON.stringify({
  'en-US': {
    translation: {
      test: 'Test'
    }
  },
  id: {
    translation: {
      test: 'Coba'
    }
  }
});

const idFile1 = {
  test: 'Coba'
};

const idFile2 = {
  test: 'Coba',
  water: 'Air'
};

const enFile1 = {
  test: 'Test'
};

const enFile2 = {
  test: 'Test',
  water: 'Water'
};

module.exports = {
  program,
  oneSkyReply,
  idFile1,
  idFile2,
  enFile1,
  enFile2
};
