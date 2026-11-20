const path = require('path');

// Whether the project has a package, resolved from the project (where Encore runs) and not from this bundle.
const projectHas = (name) => {
    try {
        require.resolve(name, { paths: [process.cwd()] });

        return true;
    } catch (error) {
        return false;
    }
};

module.exports = (Encore) => {
    const aliases = {
        '@masilia-admin-kit': path.resolve(__dirname, '../public/admin'),
    };

    // The dropdown of the Ibexa Design System imports react-popper, which Ibexa does not declare. When the project does not have it,
    // a stand-in for the one hook the dropdown uses is aliased: nothing to install. A project that has the real package keeps it.
    if (!projectHas('react-popper')) {
        aliases['react-popper'] = path.resolve(__dirname, '../public/admin/shims/react-popper.js');
    }

    Encore.addAliases(aliases);
};
