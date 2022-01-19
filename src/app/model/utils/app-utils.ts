import * as Highcharts from "highcharts";
import * as moment from "moment";

export class AppUtils {

    static numberFormat(n: number, decimals?: number): string {
        if (decimals) {
            return parseFloat(n.toFixed(decimals)).toLocaleString();
        }
        return n.toLocaleString().replace(/\./g,'*').replace(/\./g,',').replace(/\*/g,'.');
    }

    static sortArrayBy(array: any[], key: string, sortAscendent: boolean = true, valueFn?: any): any[] {
        return array.sort(function(a, b)  {
            let x = (valueFn)? valueFn(a[key]) : a[key]; 
            let y = (valueFn)? valueFn(b[key]) : b[key];

            if (sortAscendent) {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    }

    static isDateFormat (val: any, formatStr: string = 'DD/MM/YYYY'): boolean {
        return moment(val, formatStr, true).isValid();
    }

    static packArray(arraySrc: any[], packSize: number): any[][]  {
        const maxItems = packSize; // Firebase max items per request
        const totalItemsToSync: number = arraySrc.length;
        let totalAdded: number = 0;
        let itemsPacked: unknown[][] = [];
    
        do {
          const endIndex = (totalItemsToSync - totalAdded >= maxItems)? totalAdded + maxItems : totalAdded + totalItemsToSync - totalAdded;
          const itemsToPack = arraySrc.slice(totalAdded, endIndex);
          itemsPacked.push(itemsToPack);
          totalAdded += itemsToPack.length;
        } while (totalAdded < totalItemsToSync);

        return itemsPacked;
    }
}