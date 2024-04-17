Example how to change CCO coupon status 


import { afetch } from "./ccom.ts"
Deno.env.set("CCO_BASE_URL", "http://192.168.0.84:8081");
  Deno.env.set("CCO_USERNAME", "API");
  Deno.env.set("CCO_PASSWORD", "Password1");
  const couponCode='321'
  
const coupons=await afetch(`${Deno.env.get("CCO_BASE_URL")}/ccos/api/internal/coupons?limit=100&offset=0&search=${couponCode}`,"GET");
if(coupons.resultList.length>0)
    {
        const coupon=coupons.resultList[0];
        
        const instances=await afetch(`${Deno.env.get("CCO_BASE_URL")}/ccos/api/internal/coupons/${coupon.uuid}/instances`,"GET");
        if(instances.resultList.length>0)
            {
                const body=JSON.stringify({
                    status:"REDEEMED"
                });
                instances.resultList.forEach(async instance => {
                    //set as redeemed
                    console.log(JSON.stringify(instance.status));
                    const url=`${Deno.env.get("CCO_BASE_URL")}/ccos/api/ui/loyalty/coupon-management/coupons/${coupon.uuid}/accountcoupons/${instance.uuid}/changestatus`;
                    const updateResult=await afetch(url,"PUT",body);
                    console.log(JSON.stringify(updateResult));
                });
            }
    }


