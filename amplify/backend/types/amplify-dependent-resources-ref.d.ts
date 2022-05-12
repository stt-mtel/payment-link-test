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
        },
        "mtelpayment": {
            "GraphQLAPIKeyOutput": "string",
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        }
    },
    "auth": {
        "mtelpaymente3573527": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    }
}