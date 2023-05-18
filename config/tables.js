const apis = require("./apis");

module.exports = {

    [apis.base + apis.admin]: {main: "admin", sub: [], where: [], select: ["*"], groupBy: [], orderBy: []},

    [apis.base + apis.home]: {
        main: "dashboard",
        sub: [],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: ["roles.role_name"]
    },
    [apis.base + apis.roles]: {main: "roles", sub: [], where: [], select: ["*"], groupBy: [], orderBy: []},
    [apis.base + apis.subAdminList]: {
        main: "admin",
        sub: [],
        where: ['role_id!=0'],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.taxList]: {main: "tax_types", sub: [], where: [], select: ["*"], groupBy: [], orderBy: []},
    [apis.base + apis.idList]: {main: "id_types", sub: [], where: [], select: ["*"], groupBy: [], orderBy: []},
    [apis.base + apis.membershipList]: {
        main: "membership_plan",
        sub: [],
        where: ['hide=0'],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.reportItemSaleByStore]: {
        main: "store",
        sub: [],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.reportItemSaleByTodayStore]: {
        main: "store_orders",
        sub: [
            ['orders', 'store_orders.order_cart_id',  'orders.cart_id'],
            ['product_varient', 'store_orders.varient_id', 'product_varient.varient_id'],
            ['product', 'product_varient.product_id', 'product.product_id']
        ],
        where: ['orders.order_status!="Cancelled"','orders.payment_method!="NULL"'],
        select: ['product.product_name,product.product_id,product.product_id'],
        groupBy: ['product.product_name', 'product.product_id', 'product.product_id'],
        orderBy: []
    },
    [apis.base + apis.reportTotalItemSalesLast30Days]: {
        main: "store_orders",
        sub: [
            ['orders', 'store_orders.order_cart_id', 'orders.cart_id'],
            ['product_varient', 'store_orders.varient_id', 'product_varient.varient_id'],
            ['product', 'product_varient.product_id', 'product.product_id']
        ],
        where: [
            'orders.payment_method!="NULL"',
            'orders.order_status="Completed"',
            'orders.delivery_date>"' + new Date(new Date().getTime() - 30 * 24 * 3600 * 1000).toISOString().slice(0, 10) + '"'
        ],
        select: ["*"], groupBy: ['product.product_name', 'product.product_id'],
        orderBy: ["store_orders.product_name"]
    },
    [apis.base + apis.reportTotalItemSalesLast30DaysDet]: {
        main: "store_orders",
        sub: [
            ['orders', 'store_orders.order_cart_id', 'orders.cart_id'],
            ['product_varient', 'store_orders.varient_id', 'product_varient.varient_id'],
            ['product', 'product_varient.product_id', 'product.product_id']
        ],
        where: [
            'orders.payment_method!="NULL"',
            'orders.order_status="Completed"',
            'orders.delivery_date>"' + new Date(new Date().getTime() - 30 * 24 * 3600 * 1000).toISOString().slice(0, 10) + '"'
        ],
        select: ['store_orders.quantity', 'store_orders.unit', 'product.product_id', 'count(store_orders.unit) as count', 'sum(store_orders.qty) as sumqty'],
        groupBy: ['store_orders.quantity', 'store_orders.unit', 'product.product_id'],
        orderBy: ["store_orders.product_name"]
    },
    [apis.base + apis.reportTax]: {
        main: "store_orders",
        sub: [
            ['orders', 'store_orders.order_cart_id', 'orders.cart_id'],
            ['product_varient', 'store_orders.varient_id', 'product_varient.varient_id'],
            ['product', 'product_varient.product_id', 'product.product_id']
        ],
        where: [
            'orders.payment_method!="NULL"',
            'store_orders.tx_price!="NULL"',
            'orders.order_status!="Cancelled"'
        ],
        select: ["*"], groupBy: ['product.product_name', 'product.product_id'],
        orderBy: []
    },

    [apis.base + apis.reportTopDeliveryBoy]: {
        main: "delivery_boy",
        sub: [],
        where: [
            'added_by="admin"'
        ],
        select: ["*"], groupBy: [],
        orderBy: []
    },
    [apis.base + apis.reportDeliveryBoy]: {
        main: "orders",
        sub: [
            ['delivery_boy', 'orders.dboy_id', 'delivery_boy.dboy_id'],
        ],
        where: [
            'orders.payment_method!="NULL"',
            'orders.order_status!="Cancelled"',
            'orders.delivery_date>"' + new Date(new Date().getTime() - 30 * 24 * 3600 * 1000).toISOString().slice(0, 10) + '"'
        ],
        select: ["*"], groupBy: ['delivery_boy.boy_name', 'delivery_boy.boy_phone'],
        orderBy: []
    },
    [apis.base + apis.reportTopStore]: {
        main: "store",
        sub: [],
        where: [],
        select: ["*"], groupBy: [],
        orderBy: []
    },
    [apis.base + apis.reportStore]: {
        main: "orders",
        sub: [
            ['store', 'orders.store_id', 'store.id']
        ],
        where: [
            'orders.payment_method!="NULL"',
            'orders.order_status!="Cancelled"',
            'orders.delivery_date>"' + new Date(new Date().getTime() - 30 * 24 * 3600 * 1000).toISOString().slice(0, 10) + '"'
        ],
        select: ["*"], groupBy: ['store.store_name', 'store.phone_number'],
        orderBy: []
    },
    [apis.base + apis.reportTopUser]: {
        main: "users",
        sub: [
            ['orders', 'users.id', 'orders.user_id']
        ],
        where: [
            'orders.payment_method!="NULL"',
            'orders.order_status!="Cancelled"',
            'orders.delivery_date="' + new Date(new Date().getTime()).toISOString().slice(0, 7) + '"'
        ],
        select: ["*"], groupBy: ['users.id', 'users.user_phone', 'users.name'],
        orderBy: []
    },
    [apis.base + apis.reportUser]: {
        main: "users",
        sub: [
            ['orders', 'users.id', 'orders.user_id']
        ],
        where: [
            'orders.payment_method!="NULL"',
            'orders.order_status!="Cancelled"',
            'orders.delivery_date="' + new Date(new Date().getTime()).toISOString().slice(0, 7) + '"'
        ],
        select: ["*"], groupBy: ['users.id', 'users.user_phone', 'users.name'],
        orderBy: []
    },
// 07 send notification
    [apis.base + apis.notificationDrivers]: {
        main: "delivery_boy",
        sub: [],
        where: ['added_by="admin"'],
        select: ["*"], groupBy: [],
        orderBy: []
    },
    [apis.base + apis.notificationStores]: {
        main: "store",
        sub: [],
        where: [],
        select: ["*"], groupBy: [],
        orderBy: []
    },
    [apis.base + apis.notificationUsers]: {
        main: "users",
        sub: [
            ['city', 'users.user_city', 'city.city_id'],
            ['society', 'users.user_area', 'society.society_id'],
            ['store', 'city.city_name', 'store.city']
        ],
        where: [],
        select: ['users.name,users.id,city.city_name,society.society_name'],
        groupBy: ['users.name', 'users.id', 'city.city_name', 'society.society_name'],
        orderBy: []
    },
    [apis.base + apis.notificationToDriver]: {
        main: "driver_notification",
        sub: [],
        where: [],
        select: ["*"], groupBy: [],
        orderBy: []
    },
    [apis.base + apis.notificationToStore]: {
        main: "store_notification",
        sub: [],
        where: [],
        select: ["*"], groupBy: [],
        orderBy: []
    },
    [apis.base + apis.notificationToUser]: {
        main: "user_notification",
        sub: [['users', 'user_notification.user_id', 'users.id']],
        where: [],
        select: ["*"], groupBy: [],
        orderBy: []
    },
// 08 notifications
    [apis.base + apis.notificationListDriver]: {
        main: "driver_notification",
        sub: [['delivery_boy', 'driver_notification.dboy_id', 'delivery_boy.dboy_id']],
        where: [],
        select: ['delivery_boy.boy_name', 'driver_notification.*'], groupBy: [],
        orderBy: []
    },
    [apis.base + apis.notificationListStore]: {
        main: "store_notification",
        sub: [['store', 'store_notification.store_id', 'store.id']],
        where: [],
        select: ["*"], groupBy: [],
        orderBy: []
    },
    [apis.base + apis.notificationListUser]: {
        main: "user_notification",
        sub: [['users', 'user_notification.user_id', 'users.id']],
        where: [],
        select: ['users.name', 'user_notification.*'], groupBy: [],
        orderBy: []
    },
// 09 tab users
    [apis.base + apis.userList]: {
        main: "users",
        sub: [
            ['city', 'users.user_city', 'city.city_id'],
            ['society', 'users.user_area', 'society.society_id']
        ], where: [], select: ["*"], groupBy: [], orderBy: ['users.reg_date desc']
    },
    [apis.base + apis.userDetail]: {
        main: "orders",
        sub: [
            ['store', 'orders.store_id', 'store.id'],
            ['users', 'orders.user_id', 'users.id'],
            ['address', 'orders.address_id', 'address.address_id']
        ],
        where: [],
        select: ["*"], groupBy: [],
        orderBy: ['orders.delivery_date DESC']
    },
    [apis.base + apis.usersWalletRechargeHistory]: {
        main: "wallet_recharge_history",
        sub: [['users', 'wallet_recharge_history.user_id', 'users.id']],
        where: [],
        select: ["*"], groupBy: [],
        orderBy: ['wallet_recharge_history DESC']
    },
    // 10 tab category
    [apis.base + apis.categoryList]: {
        main: "categories",
        sub: [],
        where: ["parent=0"],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.categoryListAll]: {
        main: "categories",
        sub: [],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.subCategoryList]: {
        main: "categories",
        sub: [['categories as catt', 'categories.parent', 'catt.cat_id']],
        where: ['categories.level=1'],
        select: ['categories.*', 'catt.title as parent_title'], groupBy: [],
        orderBy: []
    },
    // 11 tab catalog
    [apis.base + apis.productList]: {
        main: "product",
        sub: [['categories', 'product.cat_id', 'categories.cat_id']],
        where: ['product.approved=1'], select: ["*"], groupBy: [], orderBy: ['product_id desc']
    },
    [apis.base + apis.productVarient]: {
        main: "product_varient",
        sub: [
            ['product', 'product_varient.product_id',  'product.product_id'],
            ['store', 'product_varient.added_by',  'store.id']
        ],
        where: [],
        select: ['product.product_image,product.product_name,product_varient.*,store.store_name,store.city,store.phone_number'],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.bulkUpload]: {main: "bulk/upload", sub: [], where: [], select: ["*"], groupBy: [], orderBy: []},
    [apis.base + apis.trendingSearchProduct]: {
        main: "product_varient",
        sub: [['product', 'product_varient.product_id', 'product.product_id'], ['categories', 'product.cat_id', 'categories.cat_id']],
        where: ['product_varient.approved=1','product.product_id!="Null"'],
        select: ["*"], groupBy: [],
        orderBy: []
    },
    [apis.base + apis.trendingSearchProductSelected]: {
        main: "trending_search",
        sub: [['product_varient', 'trending_search.varient_id', 'product_varient.varient_id'], ['product', 'product_varient.product_id', 'product.product_id']],
        where: [],
        select: ["*"], groupBy: [],
        orderBy: []
    },
    [apis.base + apis.storeProductsList]: {
        main: "product_varient",
        sub: [['product', 'product_varient.product_id', 'product.product_id'], ['store', 'product_varient.added_by', 'store.id']],
        where: [],
        select: ['product.product_image', 'product.product_name', 'product_varient.*', 'store.store_name', 'store.city', 'store.phone_number'],
        groupBy: [],
        orderBy: []
    },
    //12 tab area
    [apis.base + apis.societyList]: {
        main: "society",
        sub: [['city', 'society.city_id', 'city.city_id']],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.areaBulkUploadCitySociety]: {
        main: "area-bulk-upload/city-society",
        sub: [],
        where: [],
        select: ["*"], groupBy: [],
        orderBy: []
    },
    [apis.base + apis.cityList]: {main: "city", sub: [], where: [], select: ["*"], groupBy: [], orderBy: []},
    // 13 tab store
    [apis.base + apis.storesWaitingForApprovalStoreList]: {
        main: "store",
        sub: [],
        where: ['admin_approval=0'],
        select: ["*"], groupBy: [],
        orderBy: []
    },
    [apis.base + apis.storesFinance]: {
        main: "store",
        sub: [['orders', 'store.id', 'orders.store_id'], ['store_earning', 'store.id', 'store_earning.store_id']],
        where: ['order_status="Completed"'],
        select: ['store.id', 'store.store_name', 'store.phone_number', 'store.address', 'store.email', 'store_earning.paid', 'SUM(orders.total_price)-SUM(orders.total_price)*(store.admin_share)/100 as sumprice'],
        groupBy: ['store.id', 'store.store_name', 'store.phone_number', 'store.address', 'store.email', 'store_earning.paid', 'store.admin_share'],
        orderBy: []
    },
    [apis.base + apis.adminStoreList]: {
        main: "store",
        sub: [],
        where: ['admin_approval= 1'],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.adminStoreOrder]: {
        main: "orders",
        sub: [
            ['users', 'orders.user_id', 'users.id'],
            ['store', 'orders.store_id', 'store.id'],
            ['address', 'orders.address_id', 'address.address_id']
        ],
        where: ['order_status!="completed"'],
        select: ["*"],
        groupBy: [],
        orderBy: ['orders.order_id ASC']
    },
    // 14 tab order
    [apis.base + apis.adminAllOrders]: {
        main: "orders",
        sub: [['store', 'orders.store_id', 'store.id'], ['users', 'orders.user_id', 'users.id'], ['address', 'orders.address_id', 'address.address_id']],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: ['orders.delivery_date DESC']
    },
    [apis.base + apis.adminCancelledOrders]: {
        main: "orders",
        sub: [
            ['store', 'orders.store_id', 'store.id'],
            ['address', 'orders.address_id', 'address.address_id'],
            ['delivery_boy', 'orders.dboy_id', 'delivery_boy.dboy_id'],
            ['users', 'orders.user_id', 'users.id']
        ],
        where: ['order_status="Cancelled" or order_status="cancelled"'],
        select: ["*"],
        groupBy: [],
        orderBy: ['orders.delivery_date DESC']
    },
    [apis.base + apis.adminCompleteOrders]: {
        main: "orders",
        sub: [
            ['store', 'orders.store_id', 'store.id'],
            ['address', 'orders.address_id', 'address.address_id'],
            ['delivery_boy', 'orders.dboy_id', 'delivery_boy.dboy_id'],
            ['users', 'orders.user_id', 'users.id']
        ],
        where: ['order_status="Completed" or order_status="completed"'],
        select: ["*"],
        groupBy: [],
        orderBy: ['orders.delivery_date DESC']
    },
    [apis.base + apis.adminOngoingOrders]: {
        main: "orders",
        sub: [
            ['store', 'orders.store_id', 'store.id'],
            ['address', 'orders.address_id', 'address.address_id'],
            ['delivery_boy', 'orders.dboy_id', 'delivery_boy.dboy_id'],
            ['users', 'orders.user_id', 'users.id']
        ],
        where: ['order_status="Confirmed" or order_status="confirmed"'],
        select: ["*"],
        groupBy: [],
        orderBy: ['orders.delivery_date DESC']
    },
    [apis.base + apis.adminOutForDeliveryOrders]: {
        main: "orders",
        sub: [
            ['store', 'orders.store_id', 'store.id'],
            ['address', 'orders.address_id', 'address.address_id'],
            ['delivery_boy', 'orders.dboy_id', 'delivery_boy.dboy_id'],
            ['users', 'orders.user_id', 'users.id']
        ],
        where: ['order_status="out_for_delivery" or order_status="Out_For_Delivery"'],
        select: ["*"],
        groupBy: [],
        orderBy: ['orders.delivery_date DESC']
    },
    [apis.base + apis.adminPaymentFailedOrders]: {
        main: "orders",
        sub: [
            ['store', 'orders.store_id', 'store.id'],
            ['address', 'orders.address_id', 'address.address_id'],
            ['delivery_boy', 'orders.dboy_id', 'delivery_boy.dboy_id'],
            ['users', 'orders.user_id', 'users.id']
        ],
        where: ['order_status="failed" or order_status="Failed"'],
        select: ["*"],
        groupBy: [],
        orderBy: ['orders.delivery_date DESC']
    },
    [apis.base + apis.adminPendingOrders]: {
        main: "orders",
        sub: [
            ['store', 'orders.store_id', 'store.id'],
            ['address', 'orders.address_id', 'address.address_id'],
            ['delivery_boy', 'orders.dboy_id', 'delivery_boy.dboy_id'],
            ['users', 'orders.user_id', 'users.id']
        ],
        where: ['order_status="pending" or order_status="Pending"'],
        select: ["*"],
        groupBy: [],
        orderBy: ['orders.delivery_date DESC']
    },
    [apis.base + apis.ordersTodayAll]: {
        main: "orders",
        sub: [
            ['store', 'orders.store_id', 'store.id'],
            ['address', 'orders.address_id', 'address.address_id'],
            ['delivery_boy', 'orders.dboy_id', 'delivery_boy.dboy_id'],
            ['users', 'orders.user_id', 'users.id']
        ],
        where: [
            'orders.order_status!="Cancelled"',
            'orders.delivery_date<"' + new Date(new Date().getTime()).toISOString().slice(0, 10) + '"',
            'orders.payment_method!="NULL"'],
        select: ['orders.*,users.*,store.*,delivery_boy.boy_name,address.*'],
        groupBy: [],
        orderBy: ['orders.delivery_date DESC']
    },
    [apis.base + apis.storeMissedOrders]: {
        main: "orders",
        sub: [
            ['store', 'orders.store_id', 'store.id'],
            ['address', 'orders.address_id', 'address.address_id'],
            ['delivery_boy', 'orders.dboy_id', 'delivery_boy.dboy_id'],
            ['users', 'orders.user_id', 'users.id']
        ],
        where: [
            'orders.order_status!="Completed"',
            'orders.order_status!="Cancelled"',
            'orders.payment_method!="NULL"',
            'orders.store_id!=0'],
        select: ['orders.*,users.*,store.*,delivery_boy.boy_name,address.*'],
        groupBy: [],
        orderBy: ['orders.delivery_date DESC']
    },
    [apis.base + apis.cancelledOrders]: {
        main: "orders",
        sub: [
            ['users', 'orders.user_id', 'users.id'],
            ['address', 'orders.address_id', 'address.address_id']
        ],
        where: ['order_status!="Completed"', 'order_status!="Cancelled"', 'payment_method!="NULL"', 'store_id=0'],
        select: ["*"],
        groupBy: [],
        orderBy: ['orders.delivery_date ASC']
    },
    [apis.base + apis.nearByStore]: {
        main: "store",
        sub: [
            ['service_area', 'store.id',  'service_area.store_id']
        ],
        where: [],
        select: ['store.id,store.store_name'],
        groupBy: ['store.id', 'store.store_name'],
        orderBy: []
    },
    // 15 tab payout
    [apis.base + apis.payoutReq]: {
        main: "payout_requests",
        sub: [
            ['store', 'payout_requests.store_id', 'store.id'],
            ['store_bank', 'payout_requests.store_id', 'store_bank.store_id'],
            ['orders', 'payout_requests.store_id', 'orders.store_id'],
            ['store_earning', 'payout_requests.store_id', 'store_earning.store_id']
        ],
        where: ['orders.order_status="Completed"', 'payout_requests.complete=0'],
        select: ['store.id,store.store_name,store.phone_number,store.address,store.email,store_earning.paid,payout_requests.payout_amt,payout_requests.complete,payout_requests.req_id,store_bank.ac_no,store_bank.ifsc,store_bank.holder_name,store_bank.bank_name,store_bank.upi,SUM(orders.total_price)-SUM(orders.total_price)*(store.admin_share)/100 as sumprice'],
        groupBy: ['store.id', 'store.store_name', 'store.phone_number', 'store.address', 'store.email', 'store_earning.paid', 'store.admin_share', 'payout_requests.payout_amt', 'payout_requests.complete', 'payout_requests.req_id', 'store_bank.ac_no', 'store_bank.ifsc', 'store_bank.holder_name', 'store_bank.bank_name', 'store_bank.upi'],
        orderBy: []
    },
    [apis.base + apis.prv]: {main: "payout_req_valid", sub: [], where: [], select: ["*"], groupBy: [], orderBy: []},
    // 16 tab reward
    [apis.base + apis.redeem]: {main: "reedem_values", sub: [], where: [], select: ["*"], groupBy: [], orderBy: []},
    [apis.base + apis.reward]: {main: "reward_points", sub: [], where: [], select: ["*"], groupBy: [], orderBy: []},
    // 17 tab delivery boy
    [apis.base + apis.dBoyList]: {
        main: "delivery_boy",
        sub: [],
        where: ['added_by="admin"'],
        select: ["*"], groupBy: [],
        orderBy: []
    },
    [apis.base + apis.dBoyStore]: {
        main: "store_delivery_boy",
        sub: [['store','store_delivery_boy.store_id','store.id']],
        where: ['added_by="admin"'],
        select: ["store.*"], groupBy: [],
        orderBy: []
    },
    [apis.base + apis.dBoyOrder]: {
        main: "orders",
        sub: [
            ['users', 'orders.user_id', 'users.id'],
            ['store', 'orders.store_id', 'store.id'],
            ['address', 'orders.address_id', 'address.address_id']
        ],
        where: ['order_status!="completed"'],
        select: ["*"],
        groupBy: [], orderBy: ['orders.delivery_date ASC']
    },
    [apis.base + apis.dBoyIncentive]: {
        main: "driver_incentive",
        sub: [
            ['delivery_boy', 'driver_incentive.dboy_id', 'delivery_boy.dboy_id'],
            ['orders', 'delivery_boy.dboy_id', 'orders.dboy_id'],
            ['driver_bank', 'delivery_boy.dboy_id', 'driver_bank.driver_id']
        ],
        // where: ['delivery_boy.added_by="store"','orders.order_status="Completed"'],
        where: ['delivery_boy.added_by="admin"', 'orders.order_status="Confirmed"'],
        select: ['delivery_boy.dboy_id,delivery_boy.boy_name,delivery_boy.boy_phone,delivery_boy.boy_loc,delivery_boy.boy_city,driver_incentive.earned_till_now,driver_incentive.paid_till_now,driver_incentive.remaining,driver_bank.bank_name,driver_bank.ac_no,driver_bank.holder_name,driver_bank.ifsc,driver_bank.upi,COUNT(orders.order_id) as count'],
        groupBy: ['delivery_boy.dboy_id,delivery_boy.boy_name,delivery_boy.boy_phone,delivery_boy.boy_loc,delivery_boy.boy_city,driver_incentive.earned_till_now,driver_incentive.paid_till_now,driver_incentive.remaining,driver_bank.bank_name,driver_bank.ac_no,driver_bank.holder_name,driver_bank.ifsc,driver_bank.upi'],
        orderBy: []
    },
    // 18 tab page
    [apis.base + apis.aboutUs]: {main: "aboutuspage", sub: [], where: [], select: ["*"], groupBy: [], orderBy: []},
    [apis.base + apis.terms]: {main: "termspage", sub: [], where: [], select: ["*"], groupBy: [], orderBy: []},
    //19 tab feedback
    [apis.base + apis.driverFeedbackList]: {
        main: "user_support",
        sub: [['delivery_boy', 'user_support.id', 'delivery_boy.dboy_id']],
        where: ['user_support.type="driver"'],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.storeFeedbackList]: {
        main: "user_support",
        sub: [['store', 'user_support.id', 'store.id']],
        where: ['user_support.type="store"'],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.userFeedbackList]: {
        main: "user_support",
        sub: [['users', 'user_support.id', 'users.id']],
        where: ['user_support.type="user"'],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    // 20 tab callback
    [apis.base + apis.driverCallbackRequests]: {
        main: "driver_callback_req",
        sub: [['delivery_boy', 'driver_callback_req.driver_id', 'delivery_boy.dboy_id'], ['store', 'delivery_boy.store_id', 'store.id']],
        where: [],
        select: ["*"], groupBy: [],
        orderBy: []
    },
    [apis.base + apis.storeCallbackRequests]: {
        main: "store_callback_req",
        sub: [],
        where: [],
        select: ["*"], groupBy: [],
        orderBy: []
    },
    [apis.base + apis.userCallbackRequests]: {
        main: "callback_req",
        sub: [['users', 'callback_req.user_id', 'users.id'], ['store', 'callback_req.store_id', 'store.id']],
        where: [],
        select: ["*"], groupBy: [],
        orderBy: []
    },
    // 21 tab settings
    [apis.base + apis.logo]: {
        main: "tbl_web_setting",
        sub: [],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.countryCode]: {
        main: "country_code",
        sub: [],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.currency]: {
        main: "currency",
        sub: [],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.fcm]: {
        main: "fcm",
        sub: [],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.timeSlot]: {
        main: "time_slot",
        sub: [],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.minSetting]: {
        main: "set_delivery_min",
        sub: [],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.msg91]: {
        main: "msg91",
        sub: [],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.twilio]: {
        main: "twilio",
        sub: [],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.sms]: {
        main: "smsby",
        sub: [],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.firebase]: {
        main: "firebase",
        sub: [],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.firebaseIso]: {
        main: "firebase_iso",
        sub: [],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.mapApi]: {
        main: "map_api",
        sub: [],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.settings]: {
        main: "settings",
        sub: [],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.mapBox]: {
        main: "mapbox",
        sub: [],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.mapSetting]: {
        main: "map_settings",
        sub: [],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.appNotice]: {
        main: "app_notice",
        sub: [],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.referral]: {
        main: "referral_points",
        sub: [],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.incentive]: {
        main: "admin_driver_incentive",
        sub: [],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.userNotNull]: {
        main: "users",
        sub: [],
        where: ['email!="NULL"','user_phone!="NULL"','referral_code!="NULL"'],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.userNotNull2]: {
        main: "users",
        sub: [],
        where: ['email!="NULL"','user_phone!="NULL"'],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.appLink]: {
        main: "app_link",
        sub: [],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },
    [apis.base + apis.imageSpace]: {
        main: "image_space",
        sub: [],
        where: [],
        select: ["*"],
        groupBy: [],
        orderBy: []
    },

    // 22 tab reason
    [apis.base + apis.cancellingReasonsList]: {
        main: "cancel_for",
        sub: [],
        where: [],
        select: ["*"], groupBy: [],
        orderBy: []
    },
};