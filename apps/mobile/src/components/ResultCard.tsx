import { Image, StyleSheet, Text, View } from 'react-native';
import type { Result } from '@/data/demo';
import { colors, radius } from '@/theme';

export function ResultCard({ result }: { result: Result }) {
  const row = (side:'home'|'away') => { const club=result[side]; const score=side==='home'?result.homePoints:result.awayPoints; const won=score>(side==='home'?result.awayPoints:result.homePoints); return <View style={styles.team}><Image source={club.logo} style={styles.logo}/><Text style={styles.name}>{club.name}</Text><Text style={[styles.score,won&&styles.winner]}>{score}</Text></View>; };
  return <View style={styles.card}><View style={styles.meta}><Text style={styles.metaText}>FT · {result.venue}</Text><Text style={styles.metaText}>{result.date}</Text></View>{row('home')}{row('away')}</View>;
}
const styles=StyleSheet.create({card:{backgroundColor:colors.panel,borderWidth:1,borderColor:colors.line,borderRadius:radius.md,padding:14},meta:{flexDirection:'row',justifyContent:'space-between',paddingBottom:8},metaText:{color:colors.muted,fontSize:9,fontWeight:'800',letterSpacing:1},team:{flexDirection:'row',alignItems:'center',gap:10,borderTopWidth:1,borderTopColor:colors.line,paddingVertical:9},logo:{width:30,height:30,resizeMode:'contain'},name:{color:colors.text,fontWeight:'800',fontSize:13,flex:1},score:{color:colors.text,fontSize:24,fontWeight:'900'},winner:{color:colors.green}});
