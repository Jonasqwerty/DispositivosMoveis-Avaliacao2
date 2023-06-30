export class Instrumento {
    public id : string;
    public tipo : string;
    public cor : string;
    public datafabricacao : string;
    public urlfoto : string;
    
    constructor(obj?: Partial<Instrumento>) {
        if (obj) {
            this.id = obj.id
            this.tipo = obj.tipo
            this.cor = obj.cor
            this.datafabricacao = obj.datafabricacao
            this.urlfoto = obj.urlfoto
         }
    }

    toFirestore() {
        const instrumento =  {
                    id : this.id,
                    tipo : this.tipo,
                    cor : this.cor,
                    datafabricacao : this.datafabricacao,
                    urlfoto : this.urlfoto
         }
         return instrumento
    }

   
    toString() {
        const Objeto = `{
            "id": "${this.id}",
            "nome": "${this.tipo}",
            "raca": "${this.cor}",
            "datafabricacao": "${this.datafabricacao}",  
            "urlfoto": "${this.urlfoto}"  
        }`
        return Objeto
    }
};
