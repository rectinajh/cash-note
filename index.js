var cash = require('./cash');

//# 输入的条码数组
//
var codeList = [
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000003-2',
    'ITEM000005',
    'ITEM000005',
    'ITEM000005'
];

cash.printNote(codeList);