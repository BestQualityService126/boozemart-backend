
const apis = require("../config/apis");
const { authJwt } = require("../middleware");

module.exports = app => {
    const generalController = require("../controllers/generalController");
    const homeController = require("../controllers/homeController");
    const adminController = require("../controllers/adminController");
    const bulkupController = require("../controllers/bulkupController");

    var router = require("express").Router();

    router.post(apis.home, [authJwt.verifyToken], homeController.get);

    router.post(apis.admin, adminController.operation);

    router.post(apis.roles, generalController.operation);
    router.post(apis.subAdminList, generalController.operation);
    router.post(apis.taxList, generalController.operation);
    router.post(apis.idList, generalController.operation);
    router.post(apis.membershipList, generalController.operation);
    router.post(apis.reportItemSaleByStore, generalController.operation);
    router.post(apis.reportItemSaleByTodayStore, generalController.operation);
    router.post(apis.reportTotalItemSalesLast30Days, generalController.operation);
    router.post(apis.reportTotalItemSalesLast30DaysDet, generalController.operation);
    router.post(apis.reportTopDeliveryBoy, generalController.operation);
    router.post(apis.reportTopStore, generalController.operation);
    router.post(apis.reportTopUser, generalController.operation);
    router.post(apis.reportDeliveryBoy, generalController.operation);
    router.post(apis.reportStore, generalController.operation);
    router.post(apis.reportUser, generalController.operation);
    router.post(apis.reportTax, generalController.operation);
    router.post(apis.notificationToDriver, generalController.operation);
    router.post(apis.notificationToStore, generalController.operation);
    router.post(apis.notificationToUser, generalController.operation);
    router.post(apis.notificationDrivers, generalController.operation);
    router.post(apis.notificationStores, generalController.operation);
    router.post(apis.notificationUsers, generalController.operation);
    router.post(apis.notificationListDriver, generalController.operation);
    router.post(apis.notificationListStore, generalController.operation);
    router.post(apis.notificationListUser, generalController.operation);
    router.post(apis.userList, generalController.operation);
    router.post(apis.userDetail, generalController.operation);
    router.post(apis.usersWalletRechargeHistory, generalController.operation);
    router.post(apis.categoryList, generalController.operation);
    router.post(apis.categoryListAll, generalController.operation);
    router.post(apis.subCategoryList, generalController.operation);
    router.post(apis.productList, generalController.operation);
    router.post(apis.productVarient, generalController.operation);
    router.post(apis.bulkUploadProduct, bulkupController.operation);
    router.post(apis.bulkUploadVarient, bulkupController.operation);
    router.post(apis.bulkUploadCity, bulkupController.operation);
    router.post(apis.bulkUploadSociety, bulkupController.operation);
    router.post(apis.trendingSearchProduct, generalController.operation);
    router.post(apis.trendingSearchProductSelected, generalController.operation);
    router.post(apis.storeProductsList, generalController.operation);
    router.post(apis.societyList, generalController.operation);
    router.post(apis.cityList, generalController.operation);
    router.post(apis.storesWaitingForApprovalStoreList, generalController.operation);
    router.post(apis.storesFinance, generalController.operation);
    router.post(apis.adminStoreList, generalController.operation);
    router.post(apis.adminStoreOrder, generalController.operation);
    router.post(apis.adminAllOrders, generalController.operation);
    router.post(apis.adminCancelledOrders, generalController.operation);
    router.post(apis.adminCompleteOrders, generalController.operation);
    router.post(apis.adminOngoingOrders, generalController.operation);
    router.post(apis.adminOutForDeliveryOrders, generalController.operation);
    router.post(apis.adminPaymentFailedOrders, generalController.operation);
    router.post(apis.adminPendingOrders, generalController.operation);
    router.post(apis.ordersTodayAll, generalController.operation);
    router.post(apis.storeMissedOrders, generalController.operation);
    router.post(apis.cancelledOrders, generalController.operation);
    router.post(apis.nearByStore, generalController.operation);
    router.post(apis.payoutReq, generalController.operation);
    router.post(apis.prv, generalController.operation);
    router.post(apis.redeem, generalController.operation);
    router.post(apis.reward, generalController.operation);
    router.post(apis.dBoyList, generalController.operation);
    router.post(apis.dBoyStore, generalController.operation);
    router.post(apis.dBoyOrder, generalController.operation);
    router.post(apis.dBoyIncentive, generalController.operation);
    router.post(apis.aboutUs, generalController.operation);
    router.post(apis.terms, generalController.operation);
    router.post(apis.driverFeedbackList, generalController.operation);
    router.post(apis.storeFeedbackList, generalController.operation);
    router.post(apis.userFeedbackList, generalController.operation);
    router.post(apis.driverCallbackRequests, generalController.operation);
    router.post(apis.storeCallbackRequests, generalController.operation);
    router.post(apis.userCallbackRequests, generalController.operation);
    router.post(apis.cancellingReasonsList, generalController.operation);

    router.post(apis.logo, generalController.operation);
    router.post(apis.countryCode, generalController.operation);
    router.post(apis.currency, generalController.operation);
    router.post(apis.fcm, generalController.operation);
    router.post(apis.timeSlot, generalController.operation);
    router.post(apis.minSetting, generalController.operation);
    router.post(apis.msg91, generalController.operation);
    router.post(apis.twilio, generalController.operation);
    router.post(apis.sms, generalController.operation);
    router.post(apis.firebase, generalController.operation);
    router.post(apis.firebaseIso, generalController.operation);
    router.post(apis.settings, generalController.operation);
    router.post(apis.mapApi, generalController.operation);
    router.post(apis.mapBox, generalController.operation);
    router.post(apis.mapSetting, generalController.operation);
    router.post(apis.appNotice, generalController.operation);
    router.post(apis.referral, generalController.operation);
    router.post(apis.incentive, generalController.operation);
    router.post(apis.userNotNull, generalController.operation);
    router.post(apis.userNotNull2, generalController.operation);
    router.post(apis.appLink, generalController.operation);
    router.post(apis.imageSpace, generalController.operation);


    app.use(apis.base, router);

};
