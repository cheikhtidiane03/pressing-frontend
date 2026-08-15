export interface ServiceModel {
  id?: number;
  libelle: string;
  prix_unitaire: number;
  description?: string | null;
  disponible: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
