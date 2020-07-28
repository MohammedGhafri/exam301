'use strict';
console.log('working')

$('.showUpdate').on('click',function(){
    $(this).next().toggle()
})