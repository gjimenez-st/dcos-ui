jest.dontMock('../../../../../../src/js/structs/DSLFilterList');
jest.dontMock('../../../../../../src/resources/grammar/SearchDSL.jison');
jest.dontMock('../../constants/HealthStatus');
jest.dontMock('../ServiceAttributeHealthFilter');
jest.dontMock('../../../../../../src/js/structs/List');

var DSLFilterList = require('../../../../../../src/js/structs/DSLFilterList');
var SearchDSL = require('../../../../../../src/resources/grammar/SearchDSL.jison');
var HealthStatus = require('../../constants/HealthStatus');
var ServiceAttributeHealthFilter = require('../ServiceAttributeHealthFilter');
var List = require('../../../../../../src/js/structs/List');

describe('ServiceAttributeHealthFilter', function () {

  beforeEach(function () {
    this.mockItems = [
      {getHealth() { return HealthStatus.HEALTHY; }},
      {getHealth() { return HealthStatus.UNHEALTHY; }},
      {getHealth() { return HealthStatus.IDLE; }},
      {getHealth() { return HealthStatus.NA; }}
    ];
  });

  it('Should correctly keep services in healthy state', function () {
    let services = new List({items: this.mockItems});
    let expr = SearchDSL.parse('is:healthy');

    let filters = new DSLFilterList().add(new ServiceAttributeHealthFilter());

    expect(expr.filter(filters, services).getItems()).toEqual([
      this.mockItems[0]
    ]);
  });

  it('Should correctly keep services in unhealthy state', function () {
    let services = new List({items: this.mockItems});
    let expr = SearchDSL.parse('is:unhealthy');

    let filters = new DSLFilterList().add(new ServiceAttributeHealthFilter());

    expect(expr.filter(filters, services).getItems()).toEqual([
      this.mockItems[1]
    ]);
  });

  it('Should correctly keep nothing on unknown states', function () {
    let services = new List({items: this.mockItems});
    let expr = SearchDSL.parse('is:foo');

    let filters = new DSLFilterList().add(new ServiceAttributeHealthFilter());

    expect(expr.filter(filters, services).getItems()).toEqual([
    ]);
  });

  it('Should be case-insensitive', function () {
    let services = new List({items: this.mockItems});
    let expr = SearchDSL.parse('is:hEaLThY');

    let filters = new DSLFilterList([
      new ServiceAttributeHealthFilter()
    ]);

    expect(expr.filter(filters, services).getItems()).toEqual([
      this.mockItems[0]
    ]);
  });
});
