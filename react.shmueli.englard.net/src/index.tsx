import { createTheme, loadTheme, Fabric, Stack, Pivot, PivotItem, DefaultButton, PrimaryButton, Toggle, Checkbox } from '@fluentui/react'

const myTheme = createTheme({
    palette: {
        themePrimary: '#0091ff',
        themeLighterAlt: '#00060a',
        themeLighter: '#001729',
        themeLight: '#002b4d',
        themeTertiary: '#005799',
        themeSecondary: '#007fe0',
        themeDarkAlt: '#199cff',
        themeDark: '#3dabff',
        themeDarker: '#70c1ff',
        neutralLighterAlt: '#323131',
        neutralLighter: '#3a3a39',
        neutralLight: '#484746',
        neutralQuaternaryAlt: '#504f4e',
        neutralQuaternary: '#575655',
        neutralTertiaryAlt: '#747271',
        neutralTertiary: '#c8c8c8',
        neutralSecondary: '#d0d0d0',
        neutralPrimaryAlt: '#dadada',
        neutralPrimary: '#ffffff',
        neutralDark: '#f4f4f4',
        black: '#f8f8f8',
        white: '#292828',
    }
});

loadTheme(myTheme);

const Content = () => {
    return (
        <Fabric applyThemeToBody>
            <Stack tokens={{ childrenGap: 8, maxWidth: 300 }}>
                <Pivot>
                    <PivotItem headerText="Home" />
                    <PivotItem headerText="Pages" />
                    <PivotItem headerText="Documents" />
                    <PivotItem headerText="Activity" />
                </Pivot>
                <Stack horizontal gap={8}>
                    <DefaultButton text="DefaultButton" />
                    <PrimaryButton text="PrimaryButton" />
                </Stack>
                <Toggle label="Enabled" />
                <Toggle label="Disabled" disabled={true} />
                <Checkbox label="Checkbox" />
                <Checkbox checked label="Checkbox Checked" />
            </Stack>
        </Fabric>
    );
}