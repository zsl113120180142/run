<template>
    <div class="four">
        <!-- <video id="video-bg" src="../../public/imgs/404.mp4"  autoplay loop width="100%" height="100%"></video> -->
        <img alt="" class="four-logo" src="../../public/imgs/404.gif">
        <!-- <a class="back" ><span class="back-span"><i class="el-icon-back"></i> 返回首页</span></a> -->
        <router-link to="/home">
            <button class="back"><span>返回首页ok?</span></button>
        </router-link>
    </div>
</template>

<script>
    export default {}
</script>

<style scoped>
    .four {
        height: 100%;
        width: 100%;
        overflow: hidden;
        background: #f4f5f4;
    }

    .four-logo {
        height: 100%;
        display: block;
        text-align: center;
        margin: -70px auto;
        z-index: 10;
        position: relative;
    }

    .back {
        display: inline-block;
        text-align: center;
        width: 150px;
        height: 45px;
        line-height: 45px;
        color: #303133;
        background: #f4f5f4;
        border: 1px solid #dddddd;
        border-radius: 5px;
        z-index: 11;
        position: absolute;
        bottom: 145px;
        left: calc(50% - 75px);
        font-size: 18px;
        font-weight: 300;
        transition: all 0.5s;
        cursor: pointer;
    }

    .back span {
        cursor: pointer;
        display: inline-block;
        position: relative;
        transition: 0.5s;
    }

    .back span:after {
        content: '»';
        position: absolute;
        opacity: 0;
        top: 0;
        right: -20px;
        transition: 0.5s;
    }

    .back:hover span {
        padding-right: 25px;
    }

    .back:hover span:after {
        opacity: 1;
        right: 0;
    }


</style>