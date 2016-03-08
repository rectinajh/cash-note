//=======================================
//数据

//# 商品库
//
var products = [{
    name: '羽毛球',
    unit: '个',
    code: 'ITEM000001',
    price: '1',
    category: 'sport'
}, {
    name: '可乐',
    unit: '瓶',
    code: 'ITEM000005',
    price: '3',
    category: 'drink'
}, {
    name: '苹果',
    unit: '斤',
    code: 'ITEM000003',
    price: '5.5',
    category: 'fruit'
}];


//# 折扣优惠
//
var discountList = ['ITEM000003'];

//# 买二送一优惠
var presentList = ['ITEM000001','ITEM000005'];

//# 购买商品
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
//==================================


Array.prototype.contains = function(item) {
    return RegExp(item).test(this);
};

(function() {
    //# 根据条码得到产品
    //
    var getProductByCode = function(code) {
        var product;
        products.forEach(function(item) {
            if (code == item.code) {
                product = item;
            }
        });
        return product;
    };


    //# 生成购买信息
    //
    var generateBuyInfo = function(code, count) {
        var buyInfo = getProductByCode(code);
        buyInfo['count'] = count;
        return buyInfo;
    }

    //＃ 生成购买列表
    //
    var buyList = {};
    codeList.forEach(function(code) {
        if (code.indexOf('-') == -1) {
            if (!buyList[code]) {
                buyList[code] = generateBuyInfo(code, 1);
            } else {
                buyList[code].count += 1;
            }
        } else {
            var splitArr = code.split('-');
            if (!buyList[splitArr[0]]) {
                buyList[splitArr[0]] = generateBuyInfo(splitArr[0], splitArr[1]);
            } else {
                buyList[splitArr[0]].count += splitArr[1];
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
            var product = buyList[code];
            product.presentCount = Math.floor(product.count / 3);
            product.totalPrice = ((product.count - Math.floor(product.count / 3)) * product.price).toFixed(2);
            product.saveUp = (Math.floor(product.count / 3) * product.price).toFixed(2);

            allPrice += parseFloat(product.totalPrice);
            allSaveUp += parseFloat(product.saveUp);

            buyPresentList.push(product);
            delete buyList[code];
        }
    });

    //# 分拣出打折商品
    //
    var buyDiscountList = [];
    discountList.forEach(function(code) {
        if (buyList[code]) {
            var product = buyList[code];
            product.totalPrice = (product.count * product.price * 0.95).toFixed(2);
            product.saveUp = (product.count * product.price * 0.05).toFixed(2);
            allPrice += parseFloat(product.totalPrice);
            allSaveUp += parseFloat(product.saveUp);
            buyDiscountList.push(buyList[code]);
            delete buyList[code];
        }
    });

    //# 分拣出常规商品
    //
    var buyNormalList = [];
    for (code in buyList) {
        var product = buyList[code];
        product.totalPrice = (product.count * product.price).toFixed(2);
        allPrice += parseFloat(product.totalPrice);
        buyNormalList.push(product);
    }


    //# 打印收银条
    //
    console.info('***<没钱赚商店>购物清单***');
    buyPresentList.forEach(function(product) {
        console.info('名称：' + product.name + '，数量：' + (product.count + product.unit) + '，单价：' + product.price + '(元)，小计：' + product.totalPrice + '(元)');
    });
    buyDiscountList.forEach(function(product) {
        console.info('名称：' + product.name + '，数量：' + (product.count + product.unit) + '，单价：' + product.price + '(元)，小计：' + product.totalPrice + '(元)，节省' + product.saveUp + '(元)');

    });
    buyNormalList.forEach(function(product) {
        console.info('名称：' + product.name + '，数量：' + (product.count + product.unit) + '，单价：' + product.price + '(元)，小计：' + product.totalPrice + '(元)');
    });
    console.info('----------------------');
    if (buyPresentList.length > 0) {
        console.info('买二送一的商品：');
        buyPresentList.forEach(function(product) {
            console.info('名称：' + product.name + '，数量：' + (product.presentCount + product.unit));
        });
        console.info('----------------------');
    }
    console.log('总计:' + allPrice.toFixed(2) + '元');
    if (allSaveUp > 0) {
        console.log('节省:' + allSaveUp.toFixed(2) + '元');
    }
    console.info('**********************');


})();