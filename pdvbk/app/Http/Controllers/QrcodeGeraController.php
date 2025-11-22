<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Payment\PaymentClient;
use MercadoPago\Exceptions\MPApiException;
use MercadoPago\Exceptions\MPException;

class QrcodeGeraController extends Controller
{
    public  function QrCodegeraPix(Request $request)
    {
       MercadoPagoConfig::setAccessToken(env("MERCADO_TOKEN_PAY"));
       MercadoPagoConfig::setRuntimeEnviroment(MercadoPagoConfig::LOCAL);
       $client = new PaymentClient();

       $request = [
        "transaction_amount" => (float)  $request->preco,
    "description" => "Web pizza- Pedido  via pix",
    "payment_method_id" => "pix",
    "payer" => [
          "email" => "pagador@exemplo.com"
    ],
       ];

       try {
        $payment = $client->create($request);

    return [
        'status' => $payment->status,
        'id_pagamento' => $payment->id,
        'codigo_pix' => $payment->point_of_interaction->transaction_data->qr_code,
        'qr_code_base64' => $payment->point_of_interaction->transaction_data->qr_code_base64,
    ];
      return response()->json([
         'status' => $payment->status,
        'id_pagamento' => $payment->id,
        'codigo_pix' => $payment->point_of_interaction->transaction_data->qr_code,
        'qr_code_base64' => $payment->point_of_interaction->transaction_data->qr_code_base64,
      ]);

       } catch (MPApiException $e) {
     return response()->json([
         'erro' => true,
        'mensagem' => $e->getApiResponse()->getContent(),
     ]);
}

    }
}
