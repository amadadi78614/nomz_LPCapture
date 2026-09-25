import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { PropsWithChildren } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';

type Props = PropsWithChildren<{ eyebrow?: string; title: string; subtitle?: string }>;
export function AppShell({ eyebrow, title, subtitle, children }: Props) {
  return <SafeAreaView style={styles.safe} edges={['top']}><ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.brand}><Image source={require('../../assets/brand/lp-mark-native.png')} style={styles.logo}/><Text style={styles.brandText}>LOWVELD PADEL</Text><View style={styles.live}><View style={styles.dot}/><Text style={styles.liveText}>LP LIVE</Text></View></View>
    <View style={styles.heading}>{eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}<Text style={styles.title}>{title}</Text>{subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}</View>{children}
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({safe:{flex:1,backgroundColor:colors.bg},scroll:{flex:1},content:{padding:18,paddingBottom:120,gap:18},brand:{flexDirection:'row',alignItems:'center',gap:9},logo:{width:34,height:34},brandText:{color:colors.text,fontWeight:'900',fontSize:15,letterSpacing:.5,flex:1},live:{flexDirection:'row',alignItems:'center',gap:6,borderWidth:1,borderColor:colors.line,borderRadius:99,paddingHorizontal:10,paddingVertical:6},dot:{width:7,height:7,borderRadius:9,backgroundColor:colors.pink},liveText:{color:colors.muted,fontSize:9,fontWeight:'900',letterSpacing:1},heading:{gap:6},eyebrow:{color:colors.gold,fontSize:10,fontWeight:'900',letterSpacing:1.6},title:{color:colors.text,fontSize:34,fontWeight:'900',letterSpacing:-1.1},subtitle:{color:colors.muted,fontSize:14,lineHeight:21,maxWidth:560}});
