<?php

namespace App\Traits ;

trait HttpRespones{
    protected function success($data ,$messge=null ,$code=200){
        return response()->json([
            'status'=> 'Request was successful ',
            'messege'=> $messge,
            'data'=> $data
        ],$code);
    }


    protected function error($data ,$messge=null ,$code=200){
        return response()->json([
            'status'=> 'Error occured ...',
            'messege'=> $messge,
            'data'=> $data
        ],$code);
    }
    
}