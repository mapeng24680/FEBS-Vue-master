<template>
    <div id="Classification">

    </div>
</template>

<script>
    export default {
        name: "Classification",
        data(){
        return{
            
        }
        },
        mounted(){
            this.getData()
        },
        methods:{
            getData(){
                this.$get('/api/sort').then(json=>{

                })
            },
        },
    }
</script>

<style scoped lang="stylus">
#Classification{
  position absolute;
  top 0;
  left 0;
  z-index 100;
  background-color #ffffff
}
</style>
