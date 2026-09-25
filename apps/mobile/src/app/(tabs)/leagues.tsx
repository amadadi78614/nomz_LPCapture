import { StyleSheet, Text, View } from 'react-native';
import { AppShell } from '@/components/AppShell';
import { competitions } from '@/data/demo';
import { colors, radius } from '@/theme';
export default function LeaguesScreen(){return <AppShell eyebrow="LOWVELD PADEL" title="Competitions" subtitle="Current campaigns and completed championships, preserved in one archive.">{competitions.map(item=><View key={item.id} style={[styles.card,{borderLeftColor:item.color}]}><Text style={[styles.label,{color:item.color}]}>{item.label}</Text><Text style={styles.title}>{item.title}</Text><Text style={styles.detail}>{item.detail}</Text><Text style={styles.link}>Open competition →</Text></View>)}</AppShell>}
const styles=StyleSheet.create({card:{backgroundColor:colors.panel,borderWidth:1,borderColor:colors.line,borderLeftWidth:4,borderRadius:radius.md,padding:18,gap:6},label:{fontSize:9,fontWeight:'900',letterSpacing:1.4},title:{color:colors.text,fontSize:22,fontWeight:'900'},detail:{color:colors.muted,fontSize:13},link:{color:colors.text,fontWeight:'800',fontSize:12,marginTop:9}});
