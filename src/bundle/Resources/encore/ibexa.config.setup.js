const path = require('path');

module.exports = (Encore) => {
    Encore.addAliases({
        '@masilia-admin-kit': path.resolve(__dirname, '../public/admin'),
    });
};
