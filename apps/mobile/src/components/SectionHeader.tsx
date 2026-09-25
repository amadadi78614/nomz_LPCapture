import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme';
export function SectionHeader({ kicker, title, aside }: { kicker: string; title: string; aside?: string }) { return <View style={styles.row}><View style={styles.copy}><Text style={styles.kicker}>{kicker}</Text><Text style={styles.title}>{title}</Text></View>{aside&&<Text style={styles.aside}>{aside}</Text>}</View>; }
const styles=StyleSheet.create({row:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',gap:12},copy:{flex:1,gap:3},kicker:{color:colors.gold,fontSize:9,fontWeight:'900',letterSpacing:1.4},title:{color:colors.text,fontSize:22,fontWeight:'900'},aside:{color:colors.muted,fontSize:11,fontWeight:'700'}});
