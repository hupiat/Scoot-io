import { IconOutline } from "@ant-design/icons-react-native";
import { Input } from "@ant-design/react-native";
import React from "react";
import { Image, SafeAreaView, View } from "react-native";
import logo from "../assets/logo.png";

export default function PageLogin() {
    return (
        <SafeAreaView>
            <Image source={logo} style={{
                width: 400,
                height: 400
            }} />
            <View>
                <Input placeholder='email' type='email-address' prefix={<IconOutline name="mail" />} />
                <Input placeholder='password' type='password' prefix={<IconOutline name="lock" />} />
            </View>
        </SafeAreaView>
    );
}