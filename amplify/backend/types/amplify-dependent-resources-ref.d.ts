export type AmplifyDependentResourcesAttributes = {
    "function": {
        "generatePaymentLinkLambda": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    },
    "api": {
        "generatePaymentLinkApi": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        }
    }
}