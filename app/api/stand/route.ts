import {teamMember} from '../../../lib/supabase/server';
import {standSource,standCheckedOn,voetbalStandRows} from '../../voetbal-stand';
export const dynamic='force-dynamic';
export async function GET(){
 if(!await teamMember())return Response.json({error:'Geen toegang'},{status:401});
 return Response.json({rows:voetbalStandRows,checkedOn:standCheckedOn,source:standSource,sourceStatus:'verified-snapshot'},{headers:{'Cache-Control':'private, no-store'}});
}
