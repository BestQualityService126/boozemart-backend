const sql = require("../config/connection");
const log = require("./log");

let data = {
    last_week: 0,
    this_week: 0,
    difference: 0,
    last_week_ord: 0,
    this_week_ord: 0,
    diff_ord: 0,
    last_week_can: 0,
    this_week_can: 0,
    diff_can: 0,
    last_week_pen: 0,
    this_week_pen: 0,
    diff_pen: 0,
    last_week_user: 0,
    this_week_user: 0,
    diff_user: 0,
    store_earning: 0,
    store_earnings: 0,
    total_earnings: 0,
    today_earnings: 0,
    admin_earnings: 0,
    top_selling: [],
    on_going: [],
};


let from = new Date(new Date().getTime() - 7 * 24 * 3600 * 1000).toISOString().slice(0, 10);
let to = new Date(new Date().getTime() - 0 * 24 * 3600 * 1000).toISOString().slice(0, 10);
let next_date = new Date().toISOString().slice(0, 10);

let query_last_week = `select sum(total_price) as value from orders where order_status="Completed" and delivery_date between "${from}" and "${to}"`;
let query_this_week = `select sum(total_price) as value from orders where order_status="Completed" and delivery_date between "${to}" and "${next_date}"`;
let query_last_week_ord = `select count(*) as value from orders where order_status="Completed" and delivery_date between "${from}" and "${to}"`;
let query_this_week_ord = `select count(*) as value from orders where order_status!="Cancelled" and delivery_date between "${to}" and "${next_date}"`;
let query_last_week_can = `select count(*) as value from orders where order_status="Cancelled" and delivery_date between "${from}" and "${to}"`;
let query_this_week_can = `select count(*) as value from orders where order_status="Cancelled" and  delivery_date between "${to}" and "${next_date}"`;
let query_last_week_pen = `select count(*) as value from orders where order_status="Pending" and delivery_date between "${from}" and "${to}"`;
let query_this_week_pen = `select count(*) as value from orders where order_status="Pending" and delivery_date between "${to}" and "${next_date}"`;

let query_last_week_user = `select count(*) as value from users where reg_date between "${from}" and "${to}"`;
let query_this_week_user = `select count(*) as value from users where reg_date between "${to}" and "${next_date}"`;
let query_total_earnings = `select sum(total_price) as value from orders where order_status="Completed"`;
let query_today_earnings = `select sum(total_price) as value  from orders where order_status="Completed" and delivery_date ="${to}"`;
let query_store_earning = `select SUM(orders.price_without_delivery)-SUM(orders.price_without_delivery)*SUM(store.admin_share)/100  as value
 from store join orders on store.id=orders.store_id 
where orders.order_status="Completed" and orders.payment_method!="Null"`;

let query_topselling = `select store_orders.store_id,store_orders.product_name,
store_orders.varient_id,store_orders.varient_image,store_orders.quantity,
store_orders.unit,store_orders.description,count(store_orders.varient_id) as count,
store_orders.varient_id,SUM(store_orders.qty) as totalqty,SUM(store_orders.price) as revenue 
from store_orders join orders on store_orders.order_cart_id=orders.cart_id 
where orders.order_status="Completed" and orders.delivery_date between "${to}" and "${next_date}" 
group by store_orders.store_id,store_orders.product_name,store_orders.varient_id,store_orders.varient_image,store_orders.quantity,store_orders.unit,store_orders.description 
order by count desc LIMIT 5`;//5 limit

let query_ongoing = `select * from orders 
join store on orders.store_id=store.id 
join users on orders.user_id=users.id
 join address on orders.address_id=address.address_id 
 join delivery_boy on orders.dboy_id=delivery_boy.dboy_id 
where orders.order_status!="Null" and orders.payment_method!="Null" order by orders.order_id desc LIMIT 5` //limit 5


exports.get = (req, res) => {
    console.log("get");
    let query = "";
    query += query_last_week + ";";
    query += query_this_week + ";";
    query += query_last_week_ord + ";";
    query += query_this_week_ord + ";";
    query += query_last_week_can + ";";
    query += query_this_week_can + ";";
    query += query_last_week_pen + ";";
    query += query_this_week_pen + ";";
    query += query_last_week_user + ";";
    query += query_this_week_user + ";";
    query += query_total_earnings + ";";
    query += query_today_earnings + ";";
    query += query_store_earning + ";";
    query += query_topselling + ";";
    query += query_ongoing + ";";
    //  console.log(query);
    sql.query(query, (err, results, fields) => {
        if (err) {
            log.writeLog(err.message || "Some error occurred while retrieving items.");
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving items."
            });
        } else {
            data.last_week = results[0][0].value === null ? 0 : results[0][0].value;
            data.this_week = results[1][0].value === null ? 0 : results[1][0].value;
            data.last_week_ord = results[2][0].value;
            data.this_week_ord = results[3][0].value;
            data.last_week_can = results[4][0].value;
            data.this_week_can = results[5][0].value;
            data.last_week_pen = results[6][0].value;
            data.this_week_pen = results[7][0].value;
            data.last_week_user = results[8][0].value;
            data.this_week_user = results[9][0].value;
            data.total_earnings = results[10][0].value === null ? 0 : results[10][0].value;
            data.today_earnings = results[11][0].value === null ? 0 : results[11][0].value;
            data.store_earnings = results[12][0].value === null ? 0 : Math.round(results[12][0].value);
            data.top_selling = results[13];
            data.on_going = results[14];
            calcDeference();
            res.send(data);
        }
    });
};

const calcDeference = () => {
    let la = data.last_week / 100;
    if (la === 0) {
        data.difference = data.this_week;
    } else {
        data.difference = Math.round((data.this_week - data.last_week) / la)
    }


    let la1 = data.last_week_ord / 100;
    if (la1 === 0) {
        data.diff_ord = data.this_week_ord;
    } else {
        data.diff_ord = Math.round((data.this_week_ord - data.last_week_ord) / la1);
    }


    let la2 = data.last_week_can / 100;
    if (la2 === 0) {
        data.diff_can = data.last_week_can;
    } else {
        data.diff_can = Math.round((data.this_week_can - data.last_week_can) / la2);
    }


    let la3 = data.last_week_pen / 100;
    if (la3 === 0) {
        data.diff_pen = data.last_week_pen;
    } else {
        data.diff_pen = Math.round((data.this_week_pen - data.last_week_pen) / la3);
    }


    let la4 = data.last_week_user / 100;
    if (la4 === 0) {
        data.diff_user = data.last_week_user;
    } else {
        data.diff_user = Math.round((data.this_week_user - data.last_week_user) / la4);
    }

    data.admin_earnings = data.total_earnings - data.store_earnings;


    let date = new Date;
};





