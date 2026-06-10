import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export function WelcomeScreen({ navigation }: any) {
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(30)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const descOpacity = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {

    Animated.sequence([
      Animated.timing(badgeOpacity, {
        toValue: 1, duration: 600, useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(titleY, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
      Animated.timing(subtitleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(descOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(buttonsOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.4, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2048&auto=format&fit=crop' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.15)', 'rgba(2,4,20,0.92)', '#020414']}
          locations={[0, 0.55, 1]}
          style={styles.gradient}
        >
          {/* Top badge */}
          <Animated.View style={[styles.topArea, { opacity: badgeOpacity }]}>
            <View style={styles.badge}>
              <Animated.View style={[styles.badgeDot, { transform: [{ scale: pulseAnim }] }]} />
              <Text style={styles.badgeText}>SISTEMA ATIVO · ISS PROTOCOL v2.4</Text>
            </View>
          </Animated.View>

          {/* Main content */}
          <View style={styles.content}>
            {/* Linha decorativa */}
            <View style={styles.decorLine} />

            <Animated.Text
              style={[styles.title, { opacity: titleOpacity, transform: [{ translateY: titleY }] }]}
            >
              VOID
            </Animated.Text>

            <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
              Telemetria Espacial{'\n'}& Reabilitação Biométrica
            </Animated.Text>

            <Animated.Text style={[styles.description, { opacity: descOpacity }]}>
              Monitore os limites físicos de pacientes em reabilitação usando dados de sensores IoT para evitar lesões, com tecnologia inspirada na ISS.
            </Animated.Text>

            {/* Stats row */}
            <Animated.View style={[styles.statsRow, { opacity: descOpacity }]}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>99.8%</Text>
                <Text style={styles.statLabel}>Uptime</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12ms</Text>
                <Text style={styles.statLabel}>Latência</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>256</Text>
                <Text style={styles.statLabel}>Sensores</Text>
              </View>
            </Animated.View>

            {/* Buttons */}
            <Animated.View style={[styles.buttonContainer, { opacity: buttonsOpacity }]}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#4F8EF7', '#2D5BE3']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.primaryGradient}
                >
                  <Text style={styles.primaryButtonText}>Acessar Sistema</Text>
                  <View style={styles.arrowIcon}>
                    <Text style={styles.arrowText}>→</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.75} onPress={() => navigation.navigate('Dashboard')}>
                <Text style={styles.playIcon}>▶</Text>
                <Text style={styles.secondaryButtonText}>Ver Demonstração</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020414',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 24,
  },
  topArea: {
    paddingHorizontal: 24,
    alignItems: 'flex-start',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79,142,247,0.12)',
    borderColor: 'rgba(79,142,247,0.3)',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    gap: 8,
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4F8EF7',
  },
  badgeText: {
    color: '#7BB3FB',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 52,
    gap: 16,
  },
  decorLine: {
    width: 48,
    height: 3,
    backgroundColor: '#4F8EF7',
    borderRadius: 2,
    marginBottom: 4,
  },
  title: {
    fontSize: 80,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 12,
    lineHeight: 80,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#C8D8F8',
    lineHeight: 32,
  },
  description: {
    fontSize: 15,
    color: '#7A8FB5',
    lineHeight: 24,
    maxWidth: width * 0.85,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4F8EF7',
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 11,
    color: '#5A6A8A',
    marginTop: 3,
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#4F8EF7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  primaryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  arrowIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 17,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    gap: 10,
  },
  playIcon: {
    color: '#7BB3FB',
    fontSize: 13,
  },
  secondaryButtonText: {
    color: '#C8D8F8',
    fontSize: 16,
    fontWeight: '500',
  },
});
