let JSESSIONID="";
const Login=async()=>{
    const resp = await fetch(`${Deno.env.get("CCO_BASE_URL")}/ccos/api/auth/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        //   "X-API-Key": "foobar",
        },
        body: JSON.stringify({lowLevel: false,userName: Deno.env.get("CCO_USERNAME"),secret:Deno.env.get("CCO_PASSWORD")})
      });
      if(resp.ok)
      {
        const cookies=resp.headers.getSetCookie();
        for (let i = 0; i < cookies.length; i++) {
            const a = cookies[i];
            const lines=a.split(';');
            for (let j = 0; j < lines.length; j++) {
                const b = lines[j];
                if(b.split('=')[0].localeCompare("JSESSIONID")==0)
                 {
                    JSESSIONID=a;
                    return;
                 }
            }
            
        }
        return false;
      }
}
const getHeaders=()=>{
    return {
        "Content-Type": "application/json",
        "Cookie":JSESSIONID
      //   "X-API-Key": "foobar",
      };
}
const afetch=async (url,method,body=null)=>{

    do
    {
        const resp = await fetch(encodeURI(url), {
            method: method,
            headers: getHeaders(),
            body:body
          });
          if(resp.status==401)
          {
                await Login();
          }
          else
          {
            if(resp.ok)
            {
                return await resp.json();
            }
            else
            {
                throw new Error(`${url} /r/n ${resp.statusText}`);
            }
            
          }

    } while(true)

}



export {afetch}