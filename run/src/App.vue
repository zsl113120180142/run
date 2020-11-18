<template>
    <div id="app" style="height:100%">
        <router-view/>
    </div>
</template>

<script>
    import admin from "./http/api/admin";
    export default {
        mounted() {
            let beginTime = 0;//开始时间
            let differTime = 0;//时间差
            window.onunload = function (){
                differTime = new Date().getTime() - beginTime;
                if(differTime <= 5) {
                    admin.logout()
                    console.log("这是关闭")
                } else {
                    console.log("这是刷新")
                }
            }
            window.onbeforeunload = function () {
                beginTime = new Date().getTime();
            }
        }
    }
</script>
