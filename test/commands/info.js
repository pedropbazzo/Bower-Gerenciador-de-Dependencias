var expect = require('expect.js');

var helpers = require('../helpers');
var info = helpers.command('info');

describe('bower info', function() {
    it('correctly reads arguments', function() {
        expect(info.readOptions(['pkg', 'property'])).to.eql([
            'pkg',
            'property'
        ]);
    });

    var meta = {
        name: 'package',
        version: '0.1.2',
        homepage: 'http://bower.io',
        description: 'Hello world!'
    };

    var meta2 = {
        name: 'package',
        version: '0.1.3',
        homepage: 'http://bower.io',
        description: 'Hello world! Hello!'
    };

    var mainPackage = new helpers.TempDir({
        '0.1.2': { 'bower.json': meta },
        '0.1.3': { 'bower.json': meta2 }
    });

    it('just returns if not package is specified', function() {
        return helpers.run(info).spread(function(results) {
            expect(results).to.be(undefined);
        });
    });

    it('shows info about given package', function() {
        mainPackage.prepareGit({});

        return helpers.run(info, [mainPackage.path]).spread(function(results) {
            expect(results).to.eql({
                latest: meta2,
                name: mainPackage.path,
                versions: ['0.1.3', '0.1.2']
            });
        });
    });
    it('should handle @ as a divider', function() {
        return helpers
            .run(info, [mainPackage.path + '@0.1.3'])
            .spread(function(results) {
                expect(results).to.eql({
                    name: 'package',
                    version: '0.1.3',
                    homepage: 'http://bower.io',
                    description: 'Hello world! Hello!'
                });
            });
    });
});
