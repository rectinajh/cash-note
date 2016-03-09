//=======================================
// 收银机配置

//# 条码字典
//
var codeDict = {
    'ITEM000001': {
        name: '羽毛球',
        unit: '个',
        price: '1',
        category: 'sport'
    },
    'ITEM000005': {
        name: '可乐',
        unit: '瓶',
        price: '3',
        category: 'drink'
    },
    'ITEM000003': {
        name: '苹果',
        unit: '斤',
        price: '5.5',
        category: 'fruit'
    }
};


//# 折扣优惠
//
var discountList = [];

//# 买二送一优惠
//
var presentList = ['ITEM000001','ITEM000005'];

//====================================================================

//# 根据条码得到产品信息
//
var getProductByCode = function(code) {
    if (codeDict[code]) {
        return codeDict[code];
    } else {
        throw new Error(code + '条码信息不能识别');
    }

};

//# 打印购买项
//
var printItem = function(buyItem) {
    if (buyItem.type.toUpperCase() == 'DISCOUNT') { // 如果buyitem类型为discount时，输出节省金额
        console.info('名称：' + buyItem.name +
            '，数量：' + (buyItem.count + buyItem.unit) +
            '，单价：' + buyItem.price +
            '(元)，小计：' + buyItem.totalPrice +
            '(元)，节省' + buyItem.saveUp + '(元)')
    } else {
        console.info('名称：' + buyItem.name +
            '，数量：' + (buyItem.count + buyItem.unit) +
            '，单价：' + buyItem.price +
            '(元)，小计：' + buyItem.totalPrice +
            '(元)');
    }
}


//# 打印收银条
//
var printNote = function(codeList) {
    var codeList = codeList || [];
    
    //# 初始化购买项
    //
    var initBuyItem = function(code, count) {
        var buyItem = codeDict[code];
        if (buyItem) {
            buyItem['count'] = count;
            return buyItem;
        } else {
            throw new Error('购买项初始化失败:' + code + '条码信息不能识别');
        }
    }

    //＃ 生成总的购买列表
    //
    var buyList = {};
    codeList.forEach(function(code) {
        if (code.indexOf('-') == -1) {
            if (!buyList[code]) {
                try {
                    buyList[code] = initBuyItem(code, 1);
                } catch (error) {
                    console.error(error.message);
                }
            } else {
                buyList[code].count++;
            }
        } else {
            var splitArr = code.split('-');
            if (!buyList[splitArr[0]]) {
                try {
                    buyList[splitArr[0]] = initBuyItem(splitArr[0], splitArr[1]);
                } catch (error) {
                    console.error(error.message);
                }
            } else {
                buyList[splitArr[0]].count += parseInt(splitArr[1]);
            }
        }
    });

    //# 总价格定义
    //
    var allPrice = 0,
        allSaveUp = 0;

    //# 分拣出赠送商品
    //
    var buyPresentList = [];
    presentList.forEach(function(code) {
        if (buyList[code] && buyList[code].count >= 3) {
            var buyItem;
            try {
                buyItem = buyList[code]
            } catch (error) {
                console.error(error.message);
                return;
            }
            buyItem.presentCount = Math.floor(buyItem.count / 3);
            buyItem.totalPrice = ((buyItem.count - Math.floor(buyItem.count / 3)) * buyItem.price).toFixed(2);
            buyItem.saveUp = (Math.floor(buyItem.count / 3) * buyItem.price).toFixed(2);
            buyItem.type = 'PRESENT';

            allPrice += parseFloat(buyItem.totalPrice);
            allSaveUp += parseFloat(buyItem.saveUp);

            buyPresentList.push(buyItem);
            delete buyList[code];
        }
    });

    //# 分拣出打折商品
    //
    var buyDiscountList = [];
    discountList.forEach(function(code) {
        if (buyList[code]) {
            var buyItem;
            try {
                buyItem = buyList[code]
            } catch (error) {
                console.error(error.message);
                return;
            }
            buyItem.totalPrice = (buyItem.count * buyItem.price * 0.95).toFixed(2);
            buyItem.saveUp = (buyItem.count * buyItem.price * 0.05).toFixed(2);
            buyItem.type = 'DISCOUNT';

            allPrice += parseFloat(buyItem.totalPrice);
            allSaveUp += parseFloat(buyItem.saveUp);
            buyDiscountList.push(buyList[code]);
            delete buyList[code];
        }
    });

    //# 分拣出常规商品
    //
    var buyNormalList = [];
    for (code in buyList) {
        var buyItem;
        try {
            buyItem = buyList[code]
        } catch (error) {
            console.error(error.message);
            return;
        }
        buyItem.totalPrice = (buyItem.count * buyItem.price).toFixed(2);
        buyItem.type = 'NORMAL';

        allPrice += parseFloat(buyItem.totalPrice);
        buyNormalList.push(buyItem);
    }

    //# 执行打印
    //

    console.info('***<没钱赚商店>购物清单***');
    buyPresentList.forEach(function(item) {
        printItem(item);
    });
    buyDiscountList.forEach(function(item) {
        printItem(item);
    });
    buyNormalList.forEach(function(item) {
        printItem(item);
    });
    console.info('----------------------');
    if (buyPresentList.length > 0) {
        console.info('买二送一的商品：');
        buyPresentList.forEach(function(product) {
            console.info('名称：' + product.name + '，数量：' + (product.presentCount + product.unit));
        });
        console.info('----------------------');
    }
    console.info('总计:' + allPrice.toFixed(2) + '元');
    if (allSaveUp > 0) {
        console.info('节省:' + allSaveUp.toFixed(2) + '元');
    }
    console.info('**********************');
}


exports.getProductByCode = getProductByCode;
exports.printNote = printNote;