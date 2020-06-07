import React, {useState, useEffect} from 'react';
import {View, ImageBackground, Text, Image, StyleSheet} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {Feather as Icon} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import ibge from '../../services/ibge'
import RNPickerSelect from 'react-native-picker-select';

interface State {
    id: number;
    sigla: string;
}

interface City {
    id: number;
    nome: string;
}

const Home = () => {
    const navigation = useNavigation();

    const[states, setStates] = useState<Array<State>>([]);
    const[selectedState, setSelectedState] = useState("0");

    const[cities, setCities] = useState<Array<City>>([]);
    const[selectedCity, setSelectedCity] = useState("0");

    useEffect(() => {
        ibge.get('estados', {params:{orderBy: 'nome'}}).then(response => {
            setStates(response.data);
        })
    }, []);

    useEffect(() => {
        if(selectedState === '0'){
            return;
        }
        ibge.get(`estados/${selectedState}/municipios`, {params:{orderBy: 'nome'}}).then(response => {
            setCities(response.data);
        })
    }, [selectedState]);

    function handleNavigationToPoints(){
        navigation.navigate('Points', {selectedState: selectedState, selectedCity: selectedCity});
    }

    function handleStateChange(value: string){
        setSelectedState(value);
    }

    function handleCityChange(value: string) {
        setSelectedCity(value)
    }

    return (
        <ImageBackground
            source={require('../../assets/home-background.png')}
            imageStyle={{width:274, height:368}}
            style={styles.container}
        >
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
            </View>

            <View style={styles.select}>
                <RNPickerSelect
                    onValueChange={(value) => handleStateChange(value)}
                    items={
                        states.map(state => (
                                {label: state.sigla, value: state.sigla}
                            ))
                    }
                />

                <RNPickerSelect
                    onValueChange={(value) => handleCityChange(value)}
                    items={
                        cities.map(city => (
                            {label: city.nome, value: city.nome}
                        ))
                    }
                />
            </View>
            <View style={styles.footer}>
                <RectButton
                    style={styles.button}
                    onPress={handleNavigationToPoints}
                >
                    <View style={styles.buttonIcon}>
                        <Text>
                            <Icon name="arrow-right" color="#FFF" size={24} />
                        </Text>
                    </View>
                    <Text style={styles.buttonText}>Entrar</Text>
                </RectButton>
            </View>
        </ImageBackground>
    )};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {},

    select: {},

    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});

export default Home;