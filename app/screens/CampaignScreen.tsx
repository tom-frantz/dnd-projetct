import React, { useState } from "react";
import { Layout } from "@ui-kitten/components";
import Scrollbars from "react-custom-scrollbars";
import { StyleSheet, TextInput } from "react-native";
import Section from "../components/Section";
import Text from "../components/Text";
import CustomTextEditor from "../components/CustomTextEditor";

interface CampaignScreenProps {}

const CampaignScreen: React.FC<CampaignScreenProps> = (props: CampaignScreenProps) => {
    return (
        <Layout level={"4"} style={styles.container}>
            <Scrollbars autoHide={true}>
                <Section first>
                    <Text category={"h1"}>Campaigns</Text>
                    <CustomTextEditor />
                </Section>
            </Scrollbars>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        display: "flex",
    },
});

export default CampaignScreen;
